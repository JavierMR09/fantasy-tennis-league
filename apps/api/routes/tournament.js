const express = require('express');
const asyncHandler = require('express-async-handler');
const prisma = require('../prisma');
const router = express.Router();

// upcoming tournaments
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const now = new Date();
    const events = await prisma.tournament.findMany({
      where: { startDate: { gte: now } },
      orderBy: { startDate: 'asc' },
    });
    res.json({ events });
  })
);

module.exports = router;
