
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const app = express();
const PORT = 5000;
app.use("/uploads", express.static("uploads"));

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
        wheater TEXT
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
        description TEXT) `);
    

    db.run(`CREATE TABLE IF NOT EXISTS marker_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marker_id INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        FOREIGN KEY(marker_id) REFERENCES markers(id)
        );
`)});

// API Endpoints

// TODOs
app.get('/api/todos', (req, res) => {
    db.all('SELECT * FROM todos', [], (err, rows) => {
        if(err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.get('/api/todos/:filter', (req, res) => {
  const filter = req.params.filter;
  let query = "SELECT * FROM todos";
  console.log("Filter: ", filter)

  if (filter === "done") query = "SELECT * FROM todos WHERE done = true";
  if (filter === "open") query = "SELECT * FROM todos WHERE done = false";

  db.all(query, [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});


app.post('/api/todos', (req, res) => {
    const { title, description, wheater } = req.body;
    console.log(req.body)
    db.run(`INSERT INTO todos(title, description, wheater) VALUES (?, ?, ?)`,
        [title, description, wheater],
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
            else {
                res.json({ updated: this.changes });
                console.log("Erfolg")
            }
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
    console.log("in db")
  db.all(
    `SELECT m.*, GROUP_CONCAT(mi.image_url, ',') AS images
     FROM markers m
     LEFT JOIN marker_images mi ON m.id = mi.marker_id
     GROUP BY m.id`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      // Bilder wieder in Arrays umwandeln
      const result = rows.map(row => ({
        ...row,
        images: row.images ? row.images.split(',') : []
      }));

      res.json(result);
    }
  );
});


app.post('/api/markers', upload.array("images", 10), (req, res) => {
  const { title, lat, lng, description } = req.body;
  const files = req.files;
    console.log("post markers ", lat,lng,title,description, " f: ",  files);
  db.run(
    `INSERT INTO markers (lat, lng, title, description) VALUES (?, ?, ?, ?)`,
    [lat, lng, title, description],
    
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const markerId = this.lastID;
      console.log("markerId ", markerId);
      // Mehrere Bilder speichern
      if (files && files.length > 0) {
        const stmt = db.prepare("INSERT INTO marker_images (marker_id, image_url) VALUES (?, ?)");
        files.forEach((file) => {
          const image_url = `/uploads/${file.filename}`;
          console.log("Image_url:", image_url);
          stmt.run(markerId, image_url);
        });
        stmt.finalize();
      }

      res.json({ id: markerId, title, lat, lng,description,
        images: files ? files.map(f => `/uploads/${f.filename}`) : []
      });
    }
  );
});


app.put('/api/markers/:id', (req, res) => {
    const {description} = req.body;
    console.log("In markers, id", description, req.params.id)
    db.run(`UPDATE markers set description=? WHERE id=?`,
        [description, req.params.id],
        function(err){
            if(err) res.status(500).json({error: err.message});
            else {
                res.json({ updated: this.changes });
                console.log("Erfolg")
            }
        }
    )
})

// Server starten
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
