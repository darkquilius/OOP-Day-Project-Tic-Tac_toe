let squares = [].slice.call(document.getElementsByClassName("square"));
let p1Wins = document.getElementById("playerOneWins");
let p2Wins = document.getElementById("playerTwoWins");
let vsComp = window.confirm("Press ok to play vs computer... Press cancel for PvP...");

class Player {
  constructor(sign, isGoing) {
    this.sign = sign;
    this.isGoing = isGoing;
    this.tiles = [];
    this.wins = 0;
    this.lastWon = false;
  }

  //  USED FOR FRONT END DOM MANIPULATION
  claimSpot = (e) => {
    e.textContent = this.sign;
    e.setAttribute("aria-busy", "true");
    this.sign === "X"
      ? e.setAttribute("style", "color: red;")
      : e.setAttribute("style", "color: blue;");
    return e;
  };
}

class Computer extends Player {
  // ONLY ADDITION IS TO KEEP TRACK OF WHERE COMP CAN MOVE ON BOARD AND WHAT HAS BEEN CLAIMED ALREADY
  constructor(sign, isGoing, remainingSquares) {
    super();
    this.sign = sign;
    this.isGoing = isGoing;
    this.tiles = [];
    this.wins = 0;
    this.lastWon = false;
    this.remainingSquares = remainingSquares;
  }
  // CHOOSES A RANDOM SPOT FOR COMPUTER OUT OF EMPTY SPOTS
  makeMove = (remainingSquares) => {
    const e =
      remainingSquares[Math.ceil(Math.random() * remainingSquares.length - 1)];
    return e;
  };
}

class Board {
  // ALL SQUARES, AND WIN COUNT SPOTS IN OBJECT
  construct(squares, p1Wins, p2Wins) {
    this.squares = squares;
    this.p1Wins = p1Wins;
    this.p2Wins = p2Wins;
  }

  // RESETS GAME TO STARTING STATE
  resetBoard = () => {
    for (let i = 0; i < squares.length; i++) {
      const element = squares[i];
      element.innerHTML = "";
      element.setAttribute("aria-busy", "false");
    }
    if (playerOne.lastWon) {
      playerTwo.isGoing = true;
      playerOne.isGoing = false;
    }
    if (playerTwo.lastWon) {
      playerOne.isGoing = true;
      playerTwo.isGoing = false;
    }
    playerOne.tiles = [];
    playerTwo.tiles = [];
    if (vsComp) {
      playerTwo.remainingSquares = squares;
    }
    return this.squares;
  };
}

class Game {
  constructor(board, player1, player2) {
    this.board = board;
    this.player1 = player1;
    this.player2 = player2;
  }

  // THE MEAT OF THE LOGIC...
  spotThingy = (e) => {
    let currentPlayer;

    // IF SPOT IS ALREADY CLAIMED, CANNOT CLICK
    if (e.getAttribute("aria-busy") === "true") {
      return;
    }
    //CHECK WHICH PLAYERS TURN IT IS
    playerOne.isGoing
      ? (currentPlayer = playerOne)
      : (currentPlayer = playerTwo);
    playerOne.isGoing = !playerOne.isGoing;
    playerTwo.isGoing = !playerTwo.isGoing;
    // LOGS USER CLAIMED TILES TO COMPARE TO WIN COMBOS
    currentPlayer.tiles.push(parseInt(e.dataset.tile));
    // LOGIC IF PLAYING VS COMPUTER
    if (vsComp) {
      //USER PLAYER GOES
      currentPlayer.claimSpot(e);
      // IF USER WINS, BLOCK COMP FROM GOING AND SWITCH PLAYER ONE BACK TO x
      if (
        game.checkWinner(
          currentPlayer,
          this.board.squares,
          this.board.p1Wins,
          this.board.p2Wins
        )
      ) {
        playerOne.isGoing = !playerOne.isGoing;
        playerTwo.isGoing = !playerTwo.isGoing;
        return;
      }
      // UPDATES AVAILABLE SQUARES IN COMPUTER OBJECT
      playerTwo.remainingSquares = playerTwo.remainingSquares.filter(
        (square) => {
          return square.dataset.tile !== e.dataset.tile;
        }
      );
      // LETS COMPUTER KNOW IT IS GOING
      playerOne.isGoing
        ? (currentPlayer = playerOne)
        : (currentPlayer = playerTwo);
      playerOne.isGoing = !playerOne.isGoing;
      playerTwo.isGoing = !playerTwo.isGoing;
      //COMP AUTOMATICALLY GOES
      e = playerTwo.makeMove(playerTwo.remainingSquares);
      // UPDATES AVAILABLE SQUARES IN COMPUTER OBJECT AFTER COMPUTER MOVE
      playerTwo.remainingSquares = playerTwo.remainingSquares.filter(
        (square) => {
          return square.dataset.tile !== e.dataset.tile;
        }
      );
      // UPDATES COMPUTER CLAIMED TILES TO COMPARE TO WIN COMBOS
      currentPlayer.tiles.push(parseInt(e.dataset.tile));
      //CLAIMS COMPUTER SPOT ON BOARD AND SEE IF COMPUTER WON
      return (
        currentPlayer.claimSpot(e) &&
        game.checkWinner(
          currentPlayer,
          this.board.squares,
          this.board.p1Wins,
          this.board.p2Wins
        )
      );
    }
    // CLAIMS CURRENT PLAYERS SPOT ON BOARD AND SEE IF USER WINS
    return (
      currentPlayer.claimSpot(e) &&
      game.checkWinner(
        currentPlayer,
        this.board.squares,
        this.board.p1Wins,
        this.board.p2Wins
      )
    );
  };

  // COMPARES PLAYER CLAIMED TILES WITH WIN COMBOS TO SEE IF THEY WON
  checkWinner = ({ tiles, sign, lastWon }) => {
    for (let y = 0; y < game.__proto__.constructor.winCombos.length; y++) {
      let count = 0;
      for (let x = 0; x < game.__proto__.constructor.winCombos[y].length; x++) {
        const number = game.__proto__.constructor.winCombos[y][x];
        let res = tiles.includes(number);
        if (!res) {
          continue;
        }
        count++;
      }
      if (count >= 3) {
        for (let i = 0; i < squares.length; i++) {
          const element = squares[i];
          element.setAttribute("aria-busy", "true");
        }
        sign === playerOne.sign ? playerOne.wins++ : playerTwo.wins++;
        lastWon = true;
        p1Wins.innerHTML = `${playerOne.wins}`;
        p2Wins.innerHTML = `${playerTwo.wins}`;
        window.alert(`${sign} Wins!! Please Reset!`);
        return true;
      }
    }
  };

  static winCombos = [
    // HORIZONTAL
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    // VERTICAL
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    // DIAGONAL
    [1, 5, 9],
    [3, 5, 7],
  ];
}

// INSTANTIATE CLASSES
let playerOne = new Player("X", true);

let playerTwo = vsComp
  ? new Computer("O", false, [].slice.call(squares))
  : new Player("O", false);

let board = new Board(squares, p1Wins, p2Wins);

let game = new Game(board, playerOne, playerTwo);
