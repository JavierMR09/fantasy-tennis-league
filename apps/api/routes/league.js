const express = require('express');
const asyncHandler = require('express-async-handler');
const prisma = require('../prisma');
const authenticate = require('../middleware/auth');
const router = express.Router();

// create a league
router.post(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    const league = await prisma.league.create({
      data: {
        name,
        ownerId: req.user.userId,
        members: { create: { userId: req.user.userId } },
      },
    });
    res.status(201).json({ league });
  })
);

// join league (public join for now)
router.post(
  '/:id/join',
  authenticate,
  asyncHandler(async (req, res) => {
    const leagueId = req.params.id;
    await prisma.leagueMember.create({
      data: { leagueId, userId: req.user.userId },
    });
    res.json({ joined: true });
  })
);

// list current user’s leagues
router.get(
  '/',
  authenticate,
  asyncHandler(async (req, res) => {
    const leagues = await prisma.league.findMany({
      where: { members: { some: { userId: req.user.userId } } },
    });
    res.json({ leagues });
  })
);

module.exports = router;
