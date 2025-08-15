// Add indexes for frequently queried fields
db.run(`CREATE INDEX IF NOT EXISTS idx_email ON users(email)`);
db.run(`CREATE INDEX IF NOT EXISTS idx_verification ON users(verification_code)`);

// Add foreign key constraints
db.run(`PRAGMA foreign_keys = ON`); 