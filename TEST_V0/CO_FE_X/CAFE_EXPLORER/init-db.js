const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('locations.db');

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

db.serialize(() => {
    const stmt = db.prepare(`INSERT INTO locations (name, category, latitude, longitude, description, address) 
        VALUES (?, ?, ?, ?, ?, ?)`);
    
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
});

db.close();