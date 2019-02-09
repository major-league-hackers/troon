let top_wall = 0;
let bot_wall = 100;
let right_wall = 100;
let left_wall = 0;

let grid;

let players = new Array(8);

let running = false;

export class TronPlayer {
  constructor(socketId, name) {
    this.socketId;
    this.id;
    this.name = name;
    this.isAlive = true;
    this.currentDirection = Math.round(Math.random() * 4) + 1;  // results in random between 1 and 4
    this.x_pos = (Math.random * 80) + 10;
    this.y_pos = (Math.random * 80) + 10;
  }

  setId(id) {
    this.id = id;
  }

  setDirection(direction) {
    this.currentDirection = direction;
  }

  move(grid) {
    //right = 1
    //left = 2
    //up = 3
    //down = 4
    // If it's not alive don't move
    if (!this.isAlive) {
      return;
    }

    const direction = this.currentDirection;
    //right
    if (direction == 1) {
      //move the head
      player.x_pos += 1;
      player.currentDirection = 1;

      //left
    } else if (direction == 2) {
      //move the head
      player.x_pos -= 1;
      player.currentDirection = 2;

      //up
    } else if (direction == 3){
      //move the head
      player.y_pos -= 1;
      player.currentDirection = 3;

      //down
    } else if (direction == 4){

      //move the head
      player.y_pos += 1;
      player.currentDirection = 4;
    }

    let id = grid[player.x_pos][player.y_pos]
    if (id !=  0) {
      this.kill();
    }

    if (player.x_pos < 0 || player.y_pos < 0 || player.x_pos  > canvas.width || player.y_pos > canvas.height) {
      this.kill();
    }

    grid[player.x_pos][player.y_pos] = player.id;
  }

  kill() {
    this.isAlive = false;
  }
}

const MAX_PLAYERS = 4;
export class TronGame {
  constructor(io) {
    this.io = io;
    this.running = false;
    this.players = {};
    this.grid = this.makeGrid();
  }

  addPlayer(player) {
    this.players[player.socketId] = player;
    player.setId(this.player.length);
    if (this.players === MAX_PLAYERS) {
      this.startGame();
    }
  }

  // initialize a game grid 100x100 square
  makeGrid() {
    let newGrid = new Array(100);

    for (let i = 0; i < grid.length; i++) {
        newGrid[i] = new Array(100);
    }

    return newGrid;
  }

  tick() {
    if (this.running) {
      for (let player in Object.values(this.players)) {
        player.move(this.grid);
      }
      sendData();
      // if (endGame()) {
      //   newGame();
      // }
    }
  }

  startGame() {
    this.running = true;
  }

  setPlayerDirection(socketId, direction) {
    this.players[socketId].setDirection(direction);
  }

  sendData() {
    //print some stuff
    for (let player in Object.values(this.players)) {
      console.log(player.name + " has location x: " + player.x_pos + ", y: " + player.y_pos + "\n");
      console.log(player.name + " is alive (T or F): " + player.isAlive + "\n");
    }
    io.sockets.emit('update', this.grid);
  }
}

// function newGame() {
//   grid = makeNewGrid();
//
//   running = false;
//
//   for (let i = 0; i < players.length; i++) {
//     players[i].x_pos = (Math.random * 80) + 10;
//     players[i].y_pos = (Math.random * 80) + 10;
//   }
// }
//
//
// function tick(){
//     let timer = -1;
//     for (let i = 0; i < players.length; i++) {
//         if (running) {
//           move(players[i]);
//         } else {
//           if (players.length >=2 ) {
//             if  (timer == -1) {
//                 timer = 10;
//             } else if (timer == 0) {
//         running = true;
//             } else {
//                 timer -= 1;
//             }
//           } else {
//             timer = -1;
//           }
//         }
//
//         sendData();
//   }
//
//     if (endGame()) {
//       newGame();
//     }
// }
//
// function sendData() {
//     //print some stuff
//     for (let i = 0; i < players.length; i++){
//       console.log(i);
//         console.log("player " + i + " has location x: " + players[i].x_pos + ", y: " + players[i].y_pos + "\n");
//         console.log("player " + i + " is alive (T or F): " + players[i].isAlive + "\n");
//     }
//     console.log(grid);
// }
//
//
// function getHead(player){
//     return [player.x_pos, player.y_pos];
// };
//
// // return true if there is only one player left alive
// function endGame(players) {
//   let count = 0;
//   for(let i = 0; i < players; i++) {
//     if(players[i].isAlive == true) {
//       count++;
//     }
//   }
//   if(count == 1) {
//     return true;
//   }
//   return false;
// }
