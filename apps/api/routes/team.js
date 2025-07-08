const express = require('express');
const asyncHandler = require('express-async-handler');
const prisma = require('../prisma');
const authenticate = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

// POST /league/:id/team
router.post(
  '/league/:id/team',
  authenticate,
  asyncHandler(async (req, res) => {
    const leagueId = req.params.id;
    const { name } = req.body;

    const team = await prisma.team.create({
      data: {
        name,
        leagueId,
        ownerId: req.user.userId,
      },
    });
    res.status(201).json({ team });
  })
);

// GET /team/:teamId
router.get(
  '/team/:teamId',
  authenticate,
  asyncHandler(async (req, res) => {
    const team = await prisma.team.findUnique({
      where: { id: req.params.teamId },
      include: { players: { include: { player: true } } },
    });
    res.json({ team });
  })
);

module.exports = router;
