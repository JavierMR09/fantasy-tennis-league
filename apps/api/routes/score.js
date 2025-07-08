const express = require('express');
const asyncHandler = require('express-async-handler');
const prisma = require('../prisma');
const router = express.Router();

// GET /league/:id/scores – current score snapshot
router.get(
  '/league/:id/scores',
  asyncHandler(async (req, res) => {
    const leagueId = req.params.id;

    const teams = await prisma.team.findMany({
      where: { leagueId },
      include: { players: { include: { player: true } } },
    });

    // compute points (simple: 1pt per match win)
    const scores = await Promise.all(
      teams.map(async (team) => {
        const wins = await prisma.matchResult.count({
          where: { winnerId: { in: team.players.map((p) => p.playerId) } },
        });
        return { teamId: team.id, teamName: team.name, points: wins };
      })
    );

    res.json({ scores });
  })
);

module.exports = router;
