const express = require('express');
const markersRouter = express.Router();
const { db } = require('../db');   
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

// World map
markersRouter.get('/', (req, res) => {
  db.all(
    `SELECT m.*, GROUP_CONCAT(mi.image_url, ',') AS images
     FROM markers m
     LEFT JOIN marker_images mi ON m.id = mi.marker_id
     WHERE account_id=?
     GROUP BY m.id`,
    [req.userId],
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


markersRouter.post('/', upload.array("images", 10), (req, res) => {
  const { title, lat, lng, description } = req.body;
  const files = req.files;
    console.log("post markers ", lat,lng,title,description, " f: ",  files);
  db.run(
    `INSERT INTO markers (account_id, lat, lng, title, description) VALUES (?,?, ?, ?, ?)`,
    [req.userId, lat, lng, title, description],
    
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


markersRouter.put('/:id', (req, res) => {
    const {description} = req.body;
    db.run(`UPDATE markers set description=? WHERE id=? and account_id=?`,
        [description, req.params.id, req.userId],
        function(err){
            if(err) res.status(500).json({error: err.message});
            else {
                res.json({ updated: this.changes });
                console.log("Erfolg")
            }
        }
    )
})

markersRouter.delete('/', (req,res) => {
  db.run(`DELETE FROM markers WHERE id = (SELECT MAX(id) FROM markers) and account_id=?`, [req.userId],
    function(err){
        if(err) res.status(500).json({ error: err.message });
        else res.json({ deleted: this.changes });})
})

markersRouter.delete('/all', (req,res) => {
  db.run(`DELETE FROM markers where account_id=?`, [req.userId], 
    function(err){
        if(err) res.status(500).json({ error: err.message });
        else res.json({ deleted: this.changes });})
})

module.exports = markersRouter; 