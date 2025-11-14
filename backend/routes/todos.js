const express = require('express');
const todosRouter = express.Router();
const { db } = require('../db'); 


todosRouter.get('/', (req, res) => {
  db.all('SELECT * FROM todos WHERE account_id = ?', [req.userId], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});



todosRouter.get('/:filter', (req, res) => {
  const filter = req.params.filter;
  let query = "SELECT * FROM todos  WHERE account_id = ?";
  console.log("Filter: ", filter)

  if (filter === "done") query += " AND done = 1";
if (filter === "open") query += " AND done = 0";

  db.all(query, [req.userId], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

todosRouter.post('/', (req, res) => {
    const { title, description, wheater } = req.body;
    console.log(req.body)
    db.run(`INSERT INTO todos(account_id, title, description, wheater) VALUES (?, ?, ?, ?)`,
        [req.userId, title, description, wheater],
        function(err) {
            if(err) res.status(500).json({ error: err.message });
            else res.json({ id: this.lastID });
        }
    );
});


todosRouter.put('/:id', (req, res) => {
    const { done } = req.body;
    db.run(`UPDATE todos SET done=? WHERE id=? and account_id=?`,
        [ done, req.params.id, req.userId],
        function(err) {
            if(err) res.status(500).json({ error: err.message });
            else {
                res.json({ updated: this.changes });
                console.log("Erfolg")
            }
        }
    );
});

todosRouter.delete('/:id', (req, res) => {
    db.run(`DELETE FROM todos WHERE id=? and account_id=?`, [req.params.id, req.userId], function(err){
        if(err) res.status(500).json({ error: err.message });
        else res.json({ deleted: this.changes });
    });
});


module.exports = todosRouter; 