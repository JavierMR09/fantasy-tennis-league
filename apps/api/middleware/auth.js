// apps/api/middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function authenticate(req, res, next) {
  const token = req.cookies[process.env.COOKIE_NAME];
  if (!token) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; 
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
