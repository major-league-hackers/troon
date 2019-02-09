const fs = require('fs');
const path = require('path');
const express  = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');

const tron = require('./server/game.js');
const TronGame = tron.TronGame;

const APP_PATH = path.join(__dirname, 'dist');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', express.static(APP_PATH));


// Socket server
let waitingGame = new TronGame(io);
// Stores the id and game
const activeGames = {};
// Stores the socketid and gameId
const activePlayers = {};

getGameForPlayer = (socketId) => {
  const gameId = activePlayers[socketId];
  return activeGames[gameId];
}

io.on('connection', socket => {
  socket.on('join', name => {
    console.log("Player joined");
    // Add the player to the game
    waitingGame.addPlayer(socket.id, name);
    // Remember the game that the player is in
    activePlayers[socket.id] = waitingGame.id;
    if (waitingGame.gameIsFull()) {
      // Since the waiting game is full, add it to active games
      activeGames[waitingGame.id] = waitingGame;
      waitingGame = new TronGame(io);
    }
  });
  socket.on('direction', direction => {
    const game = getGameForPlayer(socket.id);
    if (game !== undefined) {
      game.setPlayerDirection(socket.id, direction);
    }
  });
  socket.on('disconnect', () => {
    // When the player disconnects, then remove them from the game
		const game = getGameForPlayer(socket.id);
    // If they aren't in an active game, then remove them from the waiting
    if (game === undefined) {
      if (waitingGame !== null) {
        waitingGame.removePlayer(socket.id);
      }
    } else {
      game.removePlayer(socket.id);
    }
  });
});

// game loop
// https://github.com/timetocode/node-game-loop
const hrtimeMs = function() {
    let time = process.hrtime();
    return time[0] * 1000 + time[1] / 1000000;
}

const TICK_RATE = 20;
let tick = 0;
let previous = hrtimeMs();
let tickLengthMs = 1000 / TICK_RATE;

const loop = () => {
    setTimeout(loop, tickLengthMs)
    let now = hrtimeMs();
    let delta = (now - previous) / 1000;
    for (let game of Object.values(activeGames)) {
      game.tick();
      if (game.endGame()) {
        console.log("endgame");
        delete activeGames[game.id];
      }
    }
    // game.update(delta, tick) // game logic would go here
    previous = now
    tick++
}

loop(); // starts the loop

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
