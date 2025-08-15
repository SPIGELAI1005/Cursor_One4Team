// Add environment configuration
require('dotenv').config();

module.exports = {
    database: {
        path: process.env.DB_PATH || './database.db'
    },
    email: {
        service: process.env.EMAIL_SERVICE || 'gmail',
        user: process.env.EMAIL_USER,
        password: process.env.EMAIL_PASSWORD
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '24h'
    }
}; 