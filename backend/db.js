const sqlite3 = require('sqlite3').verbose();
// SQLite DB initialisieren
const db = new sqlite3.Database('./planner.db', (err) => {
    if(err) console.error(err.message);
    else console.log('Connected to SQLite DB.');
});

// Tabellen erstellen
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS account (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL)`);

    db.run(`CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        done INTEGER DEFAULT 0,
        wheater TEXT,
        FOREIGN KEY (account_id) REFERENCES account(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        start TEXT,
        end TEXT,
        FOREIGN KEY (account_id) REFERENCES account(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS markers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id INTEGER NOT NULL,
        lat DOUBLE PRECISION NOT NULL,
        lng DOUBLE PRECISION NOT NULL,
        title VARCHAR(255),
        description TEXT,
        FOREIGN KEY (account_id) REFERENCES account(id)) `);
    

    db.run(`CREATE TABLE IF NOT EXISTS marker_images (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        marker_id INTEGER NOT NULL,
        image_url TEXT NOT NULL,
        FOREIGN KEY(marker_id) REFERENCES markers(id)
        );
`       )

      // to activate foreign keys
      db.run('PRAGMA foreign_keys = ON;');

});

module.exports = { db };