const dotenv = require('dotenv');
const path = require('path');

// Load environment-specific .env file
dotenv.config({
    path: path.join(__dirname, `../.env.${process.env.NODE_ENV || 'development'}`)
});

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpirationInterval: process.env.JWT_EXPIRATION_MINUTES || 60,
    email: {
        service: process.env.EMAIL_SERVICE,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    },
    db: {
        path: process.env.DB_PATH || './database.db'
    }
};

module.exports = config; 