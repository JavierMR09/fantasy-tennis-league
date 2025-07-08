// apps/api/routes/auth.js
require('dotenv').config();         // ensure process.env.JWT_SECRET
const express = require('express');
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email/password required' });

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(400).json({ error: 'User already exists' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hashed, name }
  });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res
    .cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,  // match your JWT_EXPIRES_IN
    })
    .status(201)
    .json({ user });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email/password required' });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  res
    .cookie(process.env.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60,
    })
    .json({ user });
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME).json({ message: 'Logged out' });
});

// GET CURRENT USER
router.get('/me', async (req, res) => {
  const token = req.cookies[process.env.COOKIE_NAME];
  if (!token) return res.json({ user: null });
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    return res.json({ user });
  } catch {
    return res.json({ user: null });
  }
});

module.exports = router;
