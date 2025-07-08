const express = require('express');
const asyncHandler = require('express-async-handler');
const prisma = require('../prisma');
const router = express.Router();

// league leaderboard
router.get(
  '/league/:id/leaderboard',
  asyncHandler(async (req, res) => {
    const leagueId = req.params.id;
    const standings = await prisma.$queryRaw`
      SELECT t.id, t.name,
        COUNT(m."winnerId") AS points
      FROM "Team" t
      LEFT JOIN "TeamPlayer" tp ON tp."teamId" = t.id
      LEFT JOIN "MatchResult" m ON m."winnerId" = tp."playerId"
      WHERE t."leagueId" = ${leagueId}
      GROUP BY t.id
      ORDER BY points DESC;
    `;
    res.json({ standings });
  })
);

// global ranking
router.get(
  '/global/leaderboard',
  asyncHandler(async (_req, res) => {
    const standings = await prisma.$queryRaw`
      SELECT u.id, u.email,
        COUNT(m."winnerId") AS points
      FROM "User" u
      LEFT JOIN "Team" t ON t."ownerId" = u.id
      LEFT JOIN "TeamPlayer" tp ON tp."teamId" = t.id
      LEFT JOIN "MatchResult" m ON m."winnerId" = tp."playerId"
      GROUP BY u.id
      ORDER BY points DESC
      LIMIT 50;
    `;
    res.json({ standings });
  })
);

module.exports = router;
