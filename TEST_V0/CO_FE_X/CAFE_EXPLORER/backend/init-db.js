const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to database successfully');
    }
});

// Create locations table
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS locations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        description TEXT,
        address TEXT
    )`);

    // Sample locations data
    const locations = [
        {
            name: 'Central Park',
            category: 'Park',
            latitude: 40.7829,
            longitude: -73.9654,
            description: 'Large public park in Manhattan',
            address: 'New York, NY'
        },
        {
            name: 'Times Square',
            category: 'Tourist Attraction',
            latitude: 40.7580,
            longitude: -73.9855,
            description: 'Major commercial intersection',
            address: 'Manhattan, NY 10036'
        }
    ];

    // Insert sample data
    const stmt = db.prepare(`
        INSERT INTO locations (name, category, latitude, longitude, description, address) 
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    locations.forEach(location => {
        stmt.run(
            location.name,
            location.category,
            location.latitude,
            location.longitude,
            location.description,
            location.address
        );
    });

    stmt.finalize();

    console.log('Database initialized successfully');
});

db.close((err) => {
    if (err) {
        console.error('Error closing database:', err);
    } else {
        console.log('Database connection closed');
    }
}); 