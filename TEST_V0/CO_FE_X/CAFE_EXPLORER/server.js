const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Connect to SQLite database with the correct path
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the locations database.');
});

// Get all locations
app.get('/api/locations', (req, res) => {
    db.all('SELECT * FROM locations', [], (err, locations) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(locations);
    });
});

// Add new location
app.post('/api/locations', (req, res) => {
    const { name, category, latitude, longitude, description, address } = req.body;
    db.run(
        `INSERT INTO locations (name, category, latitude, longitude, description, address) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [name, category, latitude, longitude, description, address],
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 