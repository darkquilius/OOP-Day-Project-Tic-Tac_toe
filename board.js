let squares = document.getElementsByClassName("square");
let p1Wins = document.getElementById("playerOneWins");
let p2Wins = document.getElementById("playerTwoWins");

class Player {
    constructor(sign, isGoing) {
      this.sign = sign;
      this.isGoing = isGoing;
      this.tiles = [];
      this.wins = 0;
      this.lastWon = false
    }

    claimSpot = (e) => {
        e.textContent = this.sign;
        e.setAttribute("aria-busy", "true");
        this.sign=== "X"? e.setAttribute("style", "color: red;"): e.setAttribute("style", "color: blue;")
        return e;
      };
  }
  
  class Board {
  
      construct(squares, p1Wins, p2Wins){
          this.squares = squares
          this.p1Wins = p1Wins
          this.p2Wins = p2Wins
      }
  
      resetBoard = () => {
          for (let i = 0; i < squares.length; i++) {
              const element = squares[i];
              element.innerHTML= ""
              element.setAttribute("aria-busy", "false");
          }
          if(playerOne.lastWon){
              playerTwo.isGoing = true
              playerOne.isGoing = false
          }
          if(playerTwo.lastWon){
              playerOne.isGoing = true
              playerTwo.isGoing = false
          }
          playerOne.tiles = [];
          playerTwo.tiles = [];
          return this.squares
      }
  }
  
  class Game {
      constructor(board, player1, player2){
          this.board = board
          this.player1= player1
          this.player2 = player2

      }

        spotThingy = (e) => {
            if (e.getAttribute("aria-busy") === "true") {
              return;
            }
            let currentPlayer;
            playerOne.isGoing ? (currentPlayer = playerOne) : (currentPlayer = playerTwo);
            playerOne.isGoing = !playerOne.isGoing;
            playerTwo.isGoing = !playerTwo.isGoing;
            currentPlayer.tiles.push(parseInt(e.dataset.tile));
            
            return currentPlayer.claimSpot(e) && game.checkWinner(currentPlayer, this.board.squares, this.board.p1Wins, this.board.p2Wins);
          }

          checkWinner = ({ tiles, sign, lastWon }) => {
            for (let y = 0; y < game.__proto__.constructor.winCombos.length; y++) {
              let count = 0
              for (let x = 0; x < game.__proto__.constructor.winCombos[y].length; x++) {
                  const number = game.__proto__.constructor.winCombos[y][x];
                  let res = tiles.includes(number)
                  if(!res){
                      continue
                  }
                  count++;
              }
              if(count >=3){
                  for (let i = 0; i < squares.length; i++) {
                      const element = squares[i];
                      element.setAttribute("aria-busy", "true");
                  }
                  sign === playerOne.sign? playerOne.wins++: playerTwo.wins++
                  lastWon = true;
                  p1Wins.innerHTML = `${playerOne.wins}`
                  p2Wins.innerHTML = `${playerTwo.wins}`
                  window.alert(`${sign} Wins!! Please Reset!`)
              }
            }
          }
            
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

let playerOne = new Player("X", true);

let playerTwo = new Player("O", false);

let board = new Board(squares, p1Wins, p2Wins);

let game = new Game(board, playerOne, playerTwo);