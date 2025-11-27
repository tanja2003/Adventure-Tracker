const express = require('express');
const accountRouter = express.Router();
const {db} = require('../db');

// Register
accountRouter.get('/register/name', (req, res) => {
  db.all(
    `Select name from account WHERE id=?`, [req.userId],
    function (err, rows) {
      if (err) res.status(500).json({error: err.message });
      else res.json(rows);
    }
  )
})

module.exports = accountRouter;