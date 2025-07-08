require('dotenv').config();
const prisma = require('../prisma');

(async () => {
  const leagues = await prisma.league.findMany();
  for (const league of leagues) {
    //   → could write aggregated scores back to a “Standing” table
    console.log(`Would recompute scores for league ${league.id}`);
  }
  console.log('✅ Score recalculation pass complete');
  process.exit(0);
})();
