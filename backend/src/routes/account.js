const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const accountRouter = express.Router();
const {db} = require('../database/db');

// helper to create token
function createToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30m' });
}

// get logged‑in user's name
accountRouter.get('/register/name', (req, res) => {
  db.all(
    `SELECT name FROM account WHERE id = ?`,
    [req.userId],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// register new account
accountRouter.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'E-Mail und Passwort sind erforderlich' });
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  db.run(
    `INSERT INTO account (name, email, password) VALUES (?, ?, ?)`,
    [name, email, hashedPassword],
    function (err) {
      if (err) {
        console.error('DB Error:', err.message);
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ error: 'E-Mail bereits registriert' });
        }
        return res.status(500).json({ error: 'Fehler beim Anlegen des Accounts' });
      }
      const token = createToken({ id: this.lastID, email, name });
      res.status(200).json({ token });
    }
  );
});

// login
accountRouter.post('/login', (req, res) => {
  const { email, password } = req.body;
  db.get('SELECT * FROM account WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'DB Fehler' });
    if (!user) return res.status(401).json({ error: 'Kein Account gefunden' });
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Falsches Passwort' });
    const token = createToken({ id: user.id, email: user.email, name: user.name });
    res.json({ token });
  });
});

// forgot password
accountRouter.post('/auth/forgotpassword', (req, res) => {
  const email = req.body.email;
  db.get('SELECT id FROM account WHERE email = ?', [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'E-Mail nicht gefunden' });
    const accountId = row.id;
    const token = crypto.randomBytes(32).toString('hex');
    const expires = Date.now() + 1000 * 60 * 15;
    db.run(
      'UPDATE account SET resetToken=?, resetTokenExpire=? WHERE id=?',
      [token, expires, accountId],
      (err) => {
        if (err) return res.status(500).json({ error: err.message });
        const url = `http://localhost:3000/reset/${token}`;
        res.json({ url, token });
      }
    );
  });
});

// reset password
accountRouter.post('/reset/password', async (req, res) => {
  const { token, password } = req.body;
  db.get(
    'SELECT id, resetTokenExpire FROM account WHERE resetToken = ?',
    [token],
    async (err, user) => {
      if (!user) return res.status(400).json({ error: 'Ungültiger Token' });
      if (user.reset_expires < Date.now()) {
        return res.status(400).json({ error: 'Token abgelaufen' });
      }
      const hash = await bcrypt.hash(password, 10);
      db.run(
        'UPDATE account SET password=?, resetToken=NULL, resetTokenExpire=NULL WHERE id=?',
        [hash, user.id]
      );
      res.json({ message: 'Passwort erfolgreich geändert' });
    }
  );
});

module.exports = accountRouter;