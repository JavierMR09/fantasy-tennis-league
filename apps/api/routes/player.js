const express = require('express');
const asyncHandler = require('express-async-handler');
const prisma = require('../prisma');
const router = express.Router();

// list all players (basic)
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const players = await prisma.player.findMany({ orderBy: { name: 'asc' } });
    res.json({ players });
  })
);

module.exports = router;
