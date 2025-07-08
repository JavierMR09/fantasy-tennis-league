require('dotenv').config();
const axios = require('axios');
const prisma = require('../prisma');

(async () => {
  const { data } = await axios.get('https://tennis-api.example.com/players');
  for (const p of data) {
    await prisma.player.upsert({
      where: { atpId: p.id },
      update: { name: p.name, nationality: p.country },
      create: {
        atpId: p.id,
        name: p.name,
        nationality: p.country,
      },
    });
  }
  console.log('✅ Player sync done');
  process.exit(0);
})();
