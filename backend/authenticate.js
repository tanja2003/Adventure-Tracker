const jwt = require('jsonwebtoken');

// TOKEN
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Kein Token gesendet' });

  const token = authHeader.split(' ')[1]; // "Bearer <token>"
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Ungültiger Token' });
    req.userId = decoded.id; // <-- Das ist deine account_id
    next();
  });
}

module.exports = authenticate;