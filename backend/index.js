



const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

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
    const { title, description, done, due_date } = req.body;
    db.run(`UPDATE todos SET title=?, description=?, done=?, due_date=? WHERE id=?`,
        [title, description, done, due_date, req.params.id],
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

// Server starten
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
