const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
require("dotenv").config();

const { db } = require('./db');               // DB
const  authenticate = require('./authenticate'); // Middleware
const todosRouter = require('./routes/todos'); // ✅ direkt importieren
const eventsRouter = require('./routes/events');
const markersRouter = require('./routes/markers');

const upload = multer({ dest: "uploads/" });
const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET;


app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', authenticate, todosRouter);
app.use('/api/events', authenticate, eventsRouter);
app.use('/api/markers', authenticate, markersRouter);

// Register

app.post('/api/register', (req, res) => {
  console.log("📩 In /api/register");
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-Mail und Passwort sind erforderlich" });
  }

  // 1️⃣ Passwort hashen
  const hashedPassword = bcrypt.hashSync(password, 10);

  // 2️⃣ Benutzer einfügen
  db.run(
    `INSERT INTO account (email, password) VALUES (?, ?)`,
    [email, hashedPassword],
    function (err) {
      if (err) {
        console.error("DB Error:", err.message);
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ error: "E-Mail bereits registriert" });
        }
        return res.status(500).json({ error: "Fehler beim Anlegen des Accounts" });
      }

      // 3️⃣ JWT Token generieren
      const token = jwt.sign(
        { id: this.lastID, email },
        JWT_SECRET, // ⚠️ Später in .env-Datei auslagern!
        { expiresIn: '2m' }
      );

      console.log("✅ Benutzer erfolgreich erstellt:", email);
      res.status(200).json({ token });
    }
  );
});


// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
   console.log("login", email, password);
  db.get('SELECT * FROM account WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'DB Fehler' });
    if (!user) return res.status(401).json({ error: 'Kein Account gefunden' });

    const valid = bcrypt.compareSync(password, user.password);
    console.log("pass", password);
    console.log("user", user.password);
    console.log("va", valid);
    if (!valid) return res.status(401).json({ error: 'Falsches Passwort' });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,  // <-- in .env speichern!
      { expiresIn: '1h' }
    );

    res.json({ token });
  });
});


// Server starten
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
