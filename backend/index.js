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
const { error } = require('console');

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

app.get('/api/register/name', authenticate, (req, res) => {

  db.all(
    `Select name from account WHERE id=?`, [req.userId],
    function (err, rows) {
      if (err) res.status(500).json({error: err.message });
      else res.json(rows);
    }
  )
})

app.post('/api/register', (req, res) => {
  console.log("📩 In /api/register");
  const {name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-Mail und Passwort sind erforderlich" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO account (name, email, password) VALUES (?, ?, ?)`,
    [name, email, hashedPassword],
    function (err) {
      if (err) {
        console.error("DB Error:", err.message);
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(400).json({ error: "E-Mail bereits registriert" });
        }
        return res.status(500).json({ error: "Fehler beim Anlegen des Accounts" });
      }

      const token = jwt.sign(
        { id: this.lastID, email, name },
        JWT_SECRET, 
        { expiresIn: '30m' }
      );

      console.log("✅ Benutzer erfolgreich erstellt:", email);
      res.status(200).json({ token });
    }
  );
});



app.post('/api/auth/forgotpassword', (req, res) => {
  const email = req.body.email;

  db.get(
    "SELECT id FROM account WHERE email=?", [email],
    (err, row) => {
      if (err) return res.status(500).json({ error:err.message});
      if (!row) {
        return res.status(404).json({ error: "E-Mail nicht gefunden" });
      }
      const accountId = row.id;
      const crypto = require("crypto");
      const token = crypto.randomBytes(32).toString("hex");
      const expires = Date.now() + 1000 * 60 * 15; // 15 Minuten gültig

      db.run(
        "UPDATE account SET resetToken=?, resetTokenExpire=? WHERE id=?",
        [token, expires, accountId],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          const url = `http://localhost:3000/reset/${token}`;
          res.json({ url, token }); // du bekommst die URL zurück
        }
      );
})})



app.post("/api/reset/password", async (req, res) => {
  const { token, password } = req.body;
  console.log("in reset password")
  db.get(
    "SELECT id, resetTokenExpire FROM account WHERE resetToken=?",
    [token],
    async (err, user) => {
      if (!user) return res.status(400).json({ error: "Ungültiger Token" });

      if (user.reset_expires < Date.now()) {
        return res.status(400).json({ error: "Token abgelaufen" });
      }

      const bcrypt = require("bcrypt");
      const hash = await bcrypt.hash(password, 10);

      db.run(
        "UPDATE account SET password=?, resetToken=NULL, resetTokenExpire=NULL WHERE id=?",
        [hash, user.id]
      );

      res.json({ message: "Passwort erfolgreich geändert" });
    }
  );
});


// Login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM account WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'DB Fehler' });
    if (!user) return res.status(401).json({ error: 'Kein Account gefunden' });

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Falsches Passwort' });

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name },
      JWT_SECRET,  // <-- in .env speichern!
      { expiresIn: '30m' }
    );

    res.json({ token });
  });
});


// Server starten
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
