
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const app = express();
const PORT = 5000;

app.use(cors());
//app.use(bodyParser.json());
app.use(express.json());

// SQLite DB initialisieren
const db = new sqlite3.Database('./planner.db', (err) => {
    if(err) console.error(err.message);
    else console.log('Connected to SQLite DB.');
});

// Tabellen erstellen
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        done INTEGER DEFAULT 0,
        due_date TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        start TEXT,
        end TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS markers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        title VARCHAR(255),
        description TEXT,
        image_url TEXT) `);
    });

// API Endpoints

// TODOs
app.get('/api/todos', (req, res) => {
    db.all('SELECT * FROM todos', [], (err, rows) => {
        if(err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/todos', (req, res) => {
    const { title, description, due_date } = req.body;
    db.run(`INSERT INTO todos(title, description, due_date) VALUES (?, ?, ?)`,
        [title, description, due_date],
        function(err) {
            if(err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID });
        }
    );
});

app.put('/api/todos/:id', (req, res) => {
    const { done } = req.body;
    db.run(`UPDATE todos SET done=? WHERE id=?`,
        [ done, req.params.id],
        function(err) {
            if(err) res.status(500).json({ error: err.message });
            else res.json({ updated: this.changes });
        }
    );
});

app.delete('/api/todos/:id', (req, res) => {
    db.run(`DELETE FROM todos WHERE id=?`, [req.params.id], function(err){
        if(err) res.status(500).json({ error: err.message });
        else res.json({ deleted: this.changes });
    });
});

// Events
app.get('/api/events', (req, res) => {
    db.all('SELECT * FROM events', [], (err, rows) => {
        if(err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/events', (req, res) => {
    console.log("POST /api/events body:", req.body);
  const { title, date, start, end } = req.body;

  db.run(
    `INSERT INTO events (title, date, start, end) VALUES (?, ?, ?, ?)`,
    [title, date, start, end],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID });
    }
  );
});

app.delete('/api/events/:id', (req, res) => {
    db.run(`DELETE FROM events WHERE id=?`, [req.params.id], function(err){
        if(err) res.status(500).json({ error: err.message });
        else res.json({ deleted: this.changes });
    });
});

// World map
app.get('/api/markers', (req, res) => {
    db.all('SELECT * FROM markers',[], (err, rows) => {
        if(err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.post('/api/markers', upload.single("image"), (req, res) => {
    //const {lat, lng, title, description, picture} = req.body
    const {title, lat, lng, description} = req.body
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    console.log("image_url", image_url)
    console.log("title", title)
    console.log("lat", lat)
    console.log("lng", lng)
    console.log("description", description)
    db.run(
        `INSERT INTO markers (lat, lng, title, description, image_url) VALUES (?, ?, ?, ?, ?)`,
        [ lat, lng, title, description, image_url],
        function (err) {
            if (err) res.status(500).json({error: err.message});
            else res.json({ id: this.lastID})
        }
    )
})

// Server starten
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
