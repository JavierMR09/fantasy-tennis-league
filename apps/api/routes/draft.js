const express = require('express');
const asyncHandler = require('express-async-handler');
const prisma = require('../prisma');
const authenticate = require('../middleware/auth');
const router = express.Router({ mergeParams: true });

/**
 * We store draft state on League:
 *   draftStarted   Boolean     @default(false)
 *   currentPick    Int?        // index in draftOrder
 *   draftOrder     String[]    // array of userIds (PostgreSQL text[])
 *
 * Add these three fields to `model League` in schema.prisma
 * then run:  npx prisma migrate dev --name add-draft-meta
 */

// POST /league/:id/draft/start
router.post(
  '/league/:id/draft/start',
  authenticate,
  asyncHandler(async (req, res) => {
    const league = await prisma.league.update({
      where: { id: req.params.id, ownerId: req.user.userId },
      data: {
        draftStarted: true,
        currentPick: 0,
        draftOrder: {
          // simple snake draft order (members sorted by createdAt)
          set: (
            await prisma.leagueMember.findMany({
              where: { leagueId: req.params.id },
              orderBy: { joinedAt: 'asc' },
            })
          ).map((m) => m.userId),
        },
      },
    });
    res.json({ league });
  })
);

// POST /league/:id/draft/pick  { playerId }
router.post(
  '/league/:id/draft/pick',
  authenticate,
  asyncHandler(async (req, res) => {
    const { playerId } = req.body;
    const league = await prisma.league.findUnique({ where: { id: req.params.id } });
    if (!league.draftStarted) return res.status(400).json({ error: 'Draft not started' });

    const drafter = league.draftOrder[league.currentPick];
    if (drafter !== req.user.userId)
      return res.status(400).json({ error: 'Not your turn' });

    // ensure player not already taken
    const taken = await prisma.teamPlayer.findFirst({
      where: { playerId, team: { leagueId: league.id } },
    });
    if (taken) return res.status(400).json({ error: 'Player already drafted' });

    // user’s team in this league
    const team = await prisma.team.findFirst({
      where: { leagueId: league.id, ownerId: req.user.userId },
    });
    if (!team) return res.status(400).json({ error: 'Create a team first' });

    await prisma.teamPlayer.create({
      data: { teamId: team.id, playerId },
    });

    // advance pick
    const nextPick = (league.currentPick + 1) % league.draftOrder.length;
    await prisma.league.update({
      where: { id: league.id },
      data: { currentPick: nextPick },
    });

    res.json({ success: true });
  })
);

module.exports = router;
