const express = require('express');
const eventsRouter = express.Router();
const { db } = require('../db'); 


eventsRouter.get('/', (req, res) => {
    db.all('SELECT * FROM events WHERE account_id = ?', [req.userId], (err, rows) => {
        if(err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

eventsRouter.post('/', (req, res) => {
    console.log("POST /api/events body:", req.body);
  const { title, date, start, end } = req.body;

  db.run(
    `INSERT INTO events (account_id, title, date, start, end) VALUES (?, ?, ?, ?, ?)`,
    [req.userId, title, date, start, end],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ id: this.lastID });
    }
  );
});

eventsRouter.delete('/:id', (req, res) => {
    db.run(`DELETE FROM events WHERE id=? and account_id=?`, [req.params.id, req.userId], function(err){
        if(err) res.status(500).json({ error: err.message });
        else res.json({ deleted: this.changes });
    });
});

module.exports = eventsRouter; 
