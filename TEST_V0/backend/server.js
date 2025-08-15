const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const csrf = require('csurf');
const NodeCache = require('node-cache');
const winston = require('winston');
const helmet = require('helmet');
const { body, validationResult } = require('express-validator');

const app = express();
const port = 3000;
const JWT_SECRET = 'your-secret-key'; // Use env variable in production

app.use(cors());
app.use(express.json());
app.use(helmet());

const db = new sqlite3.Database('./database.db');

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // Replace with your email
        pass: 'your-app-password' // Replace with your app password
    }
});

// Update database schema to include verification fields
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    verification_code TEXT,
    is_verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Generate verification code
function generateVerificationCode() {
    return crypto.randomInt(100000, 999999).toString();
}

// Send verification email
async function sendVerificationEmail(email, code) {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'COXFE - Email Verification',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #00B4D8;">Welcome to COXFE!</h2>
                <p>Your verification code is:</p>
                <h1 style="color: #333; font-size: 32px; letter-spacing: 5px;">${code}</h1>
                <p>Please enter this code to verify your email address.</p>
                <p>This code will expire in 1 hour.</p>
            </div>
        `
    };

    return transporter.sendMail(mailOptions);
}

// Add rate limiting for login attempts and API calls
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Add password complexity requirements
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && 
           hasNumbers && hasSpecialChar;
}

// Add CSRF protection
app.use(csrf({ cookie: true }));

// Add caching for recipes
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

app.get('/api/recipes/:mood', (req, res) => {
    const { mood } = req.params;
    const cacheKey = `recipes_${mood}`;
    
    let recipes = cache.get(cacheKey);
    if (recipes) {
        return res.json(recipes);
    }
    
    // Your existing database query...
    // Then cache the results:
    cache.set(cacheKey, recipes);
});

// Validate registration input
const validateRegistration = [
    body('email').isEmail().normalizeEmail(),
    body('password').custom(validatePassword),
    body('username').trim().isLength({ min: 3, max: 50 })
];

// Register endpoint
app.post('/api/register', validateRegistration, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationCode = generateVerificationCode();
        
        db.run(
            'INSERT INTO users (username, email, password, verification_code) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, verificationCode],
            async function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Username or email already exists' });
                    }
                    return res.status(500).json({ error: err.message });
                }

                try {
                    await sendVerificationEmail(email, verificationCode);
                    res.status(201).json({ 
                        message: 'Registration successful! Please check your email for verification code.',
                        email: email
                    });
                } catch (emailErr) {
                    console.error('Error sending email:', emailErr);
                    res.status(500).json({ error: 'Error sending verification email' });
                }
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Verify email endpoint
app.post('/api/verify-email', (req, res) => {
    const { email, code } = req.body;

    db.get(
        'SELECT * FROM users WHERE email = ? AND verification_code = ?',
        [email, code],
        function(err, user) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!user) {
                return res.status(400).json({ error: 'Invalid verification code' });
            }

            db.run(
                'UPDATE users SET is_verified = 1, verification_code = NULL WHERE id = ?',
                [user.id],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }
                    res.json({ message: 'Email verified successfully' });
                }
            );
        }
    );
});

// Update login endpoint to check verification
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(400).json({ error: 'User not found' });
        if (!user.is_verified) return res.status(400).json({ error: 'Please verify your email first' });
        
        try {
            if (await bcrypt.compare(password, user.password)) {
                const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);
                res.json({ token });
            } else {
                res.status(400).json({ error: 'Invalid password' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
});

// Add a central error handler
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ 
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal Server Error' 
            : err.message 
    });
});

// ... rest of your server code ... 