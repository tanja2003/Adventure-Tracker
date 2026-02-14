const express = require('express');
const cors = require('cors');
const multer = require('multer');
require('dotenv').config();

const { db } = require('./database/db');               // DB
const authenticate = require('./middlewares/authenticate'); // Middleware
const todosRouter = require('./routes/todos'); // ✅ direkt importieren
const eventsRouter = require('./routes/events');
const markersRouter = require('./routes/markers');
const upload = multer({ dest: "uploads/" });
const app = express();
const PORT = process.env.PORT || 5000;


app.use("/uploads", express.static("uploads"));
app.use(cors());
app.use(express.json());

// mount routers
app.use('/api/todos', authenticate, todosRouter);
app.use('/api/events', authenticate, eventsRouter);
app.use('/api/markers', authenticate, markersRouter);
app.use('/api', require('./routes/account'));




// Server starten
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
