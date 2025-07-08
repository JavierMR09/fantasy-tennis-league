// apps/api/index.js
require('dotenv').config();
const express      = require('express');
const cookieParser = require('cookie-parser');
const authRoutes   = require('./routes/auth');
const authenticate = require('./middleware/auth');
const leagueRoutes    = require('./routes/league');
const teamRoutes      = require('./routes/team');
const draftRoutes     = require('./routes/draft');
const playerRoutes    = require('./routes/player');
const tournamentRoutes= require('./routes/tournament');
const scoreRoutes     = require('./routes/score');
const leaderboardRoutes= require('./routes/leaderboard');

const app  = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

// Public auth endpoints
app.use('/auth', authRoutes);


app.use('/league',      leagueRoutes);


// standalone team endpoints
app.use('/team',        teamRoutes); 


// draft helpers
app.use('/draft',       draftRoutes);      


app.use('/players',     playerRoutes);


app.use('/tournaments', tournamentRoutes);


// /league/:id/scores
app.use('/',            scoreRoutes);      


// /league/:id/leaderboard
app.use('/',            leaderboardRoutes); 



// Example protected endpoint
app.get('/protected', authenticate, (req, res) => {
  res.json({ message: `Hello, user ${req.user.userId}` });
});



// Healthcheck / root
app.get('/', (req, res) => {
  res.send("Hello from Fantasy Tennis API!");
});



app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
