// Separate database connection management
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');

async function getDbConnection() {
    try {
        const db = await open({
            filename: './database.db',
            driver: sqlite3.Database
        });
        await db.run('PRAGMA foreign_keys = ON');
        return db;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
}

module.exports = { getDbConnection }; 