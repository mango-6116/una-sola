import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as CT from 'js-combinatorics';
import Sample from '@stdlib/random-sample';
import  JSConfetti  from 'js-confetti';
import { GameLevel } from '../game-board/game-board.component';


export interface moveStep {
  row: number;
  col: number;
}

export interface boardPiece {
  piece: string;
  row: number;
  col: number;
}

@Component({
  selector: 'app-play-board',
  templateUrl: './play-board.component.html',
  styleUrls: ['./play-board.component.css']
})
export class PlayBoardComponent implements OnInit {

  // Originally this input was for the game string from the outter board
  // It is still used for that on normal play, but some 'hacks' were added for dev:
  // solve : run brute force solver and show results in console
  // gen : generate random level (may or may not have solution)
  // cycle : generate bunch of solvable levels (some options apply, see method)
  //         i.e. cycle:4:PPPPRRNN => levels will have 4 pieces on the board with up to 
  //         4 pawns, 2 rooks and 2 knights.
  //         levels are added to the game dropdown but will be lost on re-load
  //         write them down if you like them! :)
  // reset : restore game dropdown to installed levels after random generation. 
  _gameString: string = '';
  @Input() set gameString(val: string) {
    if (!!val) {
      val = val.trimStart().trimEnd();
      var command = val.toLowerCase();
      if (command == 'solve') {
      // intialize brute force solver:
        this.startSolver();
      }else if (command == 'gen') {
        // intialize single random gen:
        this.genSample();
      }else if (command.startsWith('cycle')) {
        // intialize series of random gen games:
        this.cycleGen(val);
      }else if (command == 'reset') {
        // back to installed levels
        this.setGames.emit([]);
      } else {
        this._gameString = val;
        this.newGame();
        this.setGameState(val);
      }
    }
  };

  get gameString(): string {
    return this._gameString;
  }

  // input to get signal for move suggestion
  @Input() set doHint(val: number) {
    if (!this.solving && val > 0) {
      // step on solution
      this.hint();
    }
  }

  // notify outer board when the game dropdown list changed (by cycle or reset)
  @Output() setGames = new EventEmitter<GameLevel[]>();

  gameState: string[][] = []; // game state as an array of rows/columns

  boardMaps: boardPiece[][] = []; // used by solver 
  mapId = 0; // used by solver 
  moveTracker: any[] = []; // used by hint
  solutions: any[] = []; // used by solver 
  pendingChecks = true; // used by solver 
  confettiSize = 32;
  genLevels: GameLevel[] = []; // used by cycle (generated levels) 
  currentStep = -1; // used by hint 
  highlightCell = -1; // used by hint  (cell to highlight = 10*row + col)
  solving = false; // used by hint 
  
  constructor() {
  }

  ngOnInit() {
    // set up confetti for wins (only once)
    if (!window['js-confetti']) {

      const setConfettiSize = (isPortrait: boolean) => this.confettiSize = isPortrait ? 64 : 32;

      // Change confetti size on portrait/landscape ...
      // Create the query list.
      const mediaQueryList = window.matchMedia("(orientation: portrait)");
      setConfettiSize(mediaQueryList.matches);

      // Define a callback function for the event listener.
      const handleOrientationChange = (mql: MediaQueryListEvent) => {
        setConfettiSize(mql.matches);
      }

      // Add the callback function as a listener to the query list.
      mediaQueryList.addEventListener("change", handleOrientationChange);

      // set up target canvas
      const canvas = document.getElementById('party') as HTMLCanvasElement;
      window['js-confetti'] = new JSConfetti({canvas});
    }
  }

  // Play code...
  ///////////////////////////////////

  // fill up game state from game string
  setGameState(val: string) {
    this.gameState = []
    var gameString = val.split(' ').join('');
    for (let r = 0; r <= 3; r++) {
      const rowString = gameString.substr(r*4, 4);
      this.gameState[r] = rowString.split('');
    }
  }

  newGame() {
    this.solutions = [];
    this.currentStep = -1;
  }

  // event handler for drop of a piece..
  checkDrop(ev: any) {
    // identify source and target of move
    const mFrom = ev.previousContainer.element.nativeElement.id.split('-');
    const mTo = ev.container.element.nativeElement.id.split('-');
    // try the move
    this.makeMove(
      {row: +mFrom[1], col: +mFrom[2]}, 
      {row: +mTo[1], col: +mTo[2]}
    );
  }

  makeMove(from: moveStep, to: moveStep) {
    // if only one piece is left after trying the move... party time!
    if (this.tryStep(from, to) == 1) {
      this.pop();
      this.currentStep = -1;
    }
  }

  // try the move and set the ending state of the game if move is valid...
  // return number of pieces left on the board
  tryStep(from: moveStep, to: moveStep) {
    const pieceMoved = this.gameState[from.row][from.col];
    const pieceTaken = this.gameState[to.row][to.col];
    let piecesLeft = 0;
    if (this.isValidMove(pieceMoved, from, pieceTaken, to)) {
      this.gameState[from.row][from.col] = '.';
      this.gameState[to.row][to.col] = pieceMoved;
      for (let r = 0; r <= 3; r++) {
        for (let c = 0; c <= 3; c++) {
            if (this.gameState[r][c] !== '.') {
              piecesLeft++;
            }
        }
      }
    }
    return piecesLeft;
  }

  // check if the move is valid based on piece type and from/to cells on the board
  isValidMove(pieceMoved: string, from: moveStep, pieceTaken: string, to: moveStep) {
    // Make sure we are capturing a piece and not a moving into empty spot
    let validMove = pieceTaken !== '.';

    if (validMove) {
      const colDiff = Math.abs(from.col - to.col);
      const rowDiff = Math.abs(from.row - to.row);
      // Check valid move based on piece being moved 
      if (pieceMoved === 'K') {
        validMove = (colDiff <= 1 && rowDiff <= 1);
      }
      if (pieceMoved === 'R') {
        validMove = (from.row === to.row || from.col === to.col) && this.isPathClear(from, to, rowDiff, colDiff);
      }
      if (pieceMoved === 'P') {
        validMove = (from.row - to.row) === 1 && colDiff === 1;
      }
      if (pieceMoved === 'B') {
        validMove = (colDiff === rowDiff) && this.isPathClear(from, to, rowDiff, colDiff);
      }
      if (pieceMoved === 'Q') {
        validMove = (colDiff === rowDiff || from.row === to.row || from.col === to.col) && this.isPathClear(from, to, rowDiff, colDiff);
      }
      if (pieceMoved === 'N') {
        validMove = (colDiff === 2 && rowDiff === 1) || (colDiff === 1 && rowDiff === 2);
      }
    }
    return validMove;
  }

  // Make sure there are no pieces blocking the path between piece moved and piece captured
  isPathClear(from: moveStep, to: moveStep, rowDiff: number, colDiff: number) {
    let pathClear = true;
    // If move is horizontal (R or Q)
    if (rowDiff === 0 && colDiff > 1) {
      const minCol = Math.min(from.col, to.col);
      const maxCol = Math.max(from.col, to.col);
      pathClear = !this.gameState[from.row].some((cell, i) => i > minCol && i < maxCol && cell !== '.');
    }

    // If move is vertical (R or Q)
    if (colDiff === 0 && rowDiff > 1) {
      const minRow = Math.min(from.row, to.row);
      const maxRow = Math.max(from.row, to.row);
      pathClear = !this.gameState.
      some((row, i) => i > minRow && i < maxRow && row[from.col] !== '.');
    }

    // If move is diagonal (B or Q)
    if (rowDiff === colDiff && rowDiff > 1) {
      const rowStep = from.row < to.row ? 1: -1;
      const colStep = from.col < to.col ? 1: -1;
      let c = from.col + colStep;
      for (let r = from.row + rowStep; r !== to.row; r += rowStep) {
        if (this.gameState[r][c] !== '.') {
          pathClear = false;
          break
        }
        c += colStep;
      }
    }
    return pathClear;
  }

  // show confetti
  pop () {
    //emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸', '💰', '💎', '💵',],
    //emojis: ['♔', '♕', '♖', '♗', '♘', '♙'],
    //emojis: ['⚡️', '💥', '🌈'],
    window['js-confetti'].addConfetti({
      emojis:['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫'],
      emojiSize: this.confettiSize,
      confettiNumber: 64
   })
  }
// end of normal play code
///////////////////////////////////


/// All code below is additional features
// not needed if we don't use 'gen', 'cycle', 'solve' and we remove 'hint' (sos button)
// Solve code... (brute force)
///////////////////////////////////
  startSolver(skipLog = false) {
    this.pendingChecks = true;
    this.boardMaps = [];
    this.moveTracker = [];
    this.solutions = [];
    this.crunch(this.boardPieces(), null);
    this.findSolutions();
    if (!skipLog) {
      console.log('~~:', this.gameString);
      // console.log('~~:', this.boardMaps);
      // console.log('~~:', this.moveTracker);
      console.log('~~:', this.solutions);
    }
    this.resetToMap(0);
  }

  // run solver if need be and use first solution 
  // find next step
  // highlight piece at cell from, make move and highlight piece at target cell, remove highlight
  hint() {
    if (!this.solutions.length) {
      this.solving = true;
      this.startSolver();
      this.solving = false;
      if (this.solutions.length) {
        this.currentStep = 0;
      }
    }
    if (this.currentStep !== -1) {
      const step = this.solutions[0][this.currentStep];
      if (!!step) {
        this.highlightCell = step[0].row * 10 + step[0].col;
        setTimeout(() => {
          this.makeMove(
            {row: step[0].row, col: step[0].col},
            {row: step[1].row, col: step[1].col}
          );
          this.highlightCell = step[1].row * 10 + step[1].col;
          this.currentStep++;
          setTimeout(() => {
            this.highlightCell = -1;
          }, 500);            
        }, 500);

      }
    }
  }

  // part of solver
  addCheckPoints(pieces: boardPiece[], index: number | null) {
    this.boardMaps.push(pieces);
    var mapId = this.boardMaps.length -1;
    this.moveTracker.push(...(this.findMoves(this.boardMaps[mapId]))
      .map(element => ({...element, result: null, mapId: mapId, prevIndex: index})));
  }

  // part of solver
  crunch(pieces: boardPiece[], index: number | null) {
    this.addCheckPoints(pieces, index);
    do {
      var safe = 0;
      var currentIndex = this.moveTracker.findIndex(pair => pair.result === null);
      var pendingWork = (currentIndex !== -1);
      if (pendingWork) {
        var pair = this.moveTracker[currentIndex];
        // console.log('~~:', this.boardMaps);
        // console.log('~~:', this.moveTracker);
        // console.log('~~~:', currentIndex, pair, this.moveTracker[currentIndex]['mapId']);
  
        this.resetToMap(pair.mapId);
        pair.result = this.tryStep(
          {row: pair[0].row, col: pair[0].col},
          {row: pair[1].row, col: pair[1].col}
        );
        if (pair.result > 1) {
          this.addCheckPoints(this.boardPieces(), currentIndex);
        }
      }
      safe++;
    } 
    while (pendingWork || safe === 200000);
    
  }

  // game state as needed by solver (array of pieces not array of cells)
  boardPieces() {
    var result: boardPiece[] = [];
    for (let r = 0; r <= 3; r++) {
      for (let c = 0; c <= 3; c++) {
        if (this.gameState[r][c] !== '.') {
          result.push({piece: this.gameState[r][c], row: r, col: c});
        }
      }
    }
    return result;
  }

  // set board at different intermediate steps for solver
  resetToMap(index: number) {
    this.setGameState('.... .... .... ....');
    this.boardMaps[index].forEach(chip => 
      this.gameState[chip.row][chip.col] = chip.piece
    );
  }

  // call combinatoric lib to get all permutations of piece pairs to try while solving
  findMoves(boardPieces: boardPiece[]) {
    var it =  new CT.Permutation(boardPieces, 2);
    return it.toArray();
  }

  // after all permutations of pieces were tried, find paths that resulted 
  // in only one piece left
  findSolutions() {
    this.solutions = this.moveTracker
    .filter(move => move.result === 1)
    .map(lastMove => [{...lastMove}]);
    this.solutions
    .forEach(solution => {
      do { 
        solution.unshift(this.moveTracker[solution[0].prevIndex])
      } while (solution[0].prevIndex !== null)
    })
  }

  // generate a random 'level'... throw random pieces onto random cells
  // by default, 7 pieces out of RKBBNNPPP
  // use spec to override that... 
  // i.e.: cycle:3:KQPPP => generate levels with only 3 pieces out 
  //       of 1 king, 1 queen and 3 pawns
  // level may have no solution... use solver to find out.
  genSample(skipLog = false, spec = '') {
    this.setGameState('.... .... .... ....');
    var allPieces = ['R', 'K', 'B', 'B', 'N', 'N', 'P', 'P', 'P', 'P'];
    var pieceCount = 7;
    var specOut = spec.split(':');
    if (specOut.length > 1) {
      pieceCount = Number(specOut[1]);
    } 
    if (specOut.length > 2) {
      allPieces = (specOut[2]).split('');
    }
    
    const allSquares = [
      {row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}, {row: 0, col: 3},
      {row: 1, col: 0}, {row: 1, col: 1}, {row: 1, col: 2}, {row: 1, col: 3}, 
      {row: 2, col: 0}, {row: 2, col: 1}, {row: 2, col: 2}, {row: 2, col: 3}, 
      {row: 3, col: 0}, {row: 3, col: 1}, {row: 3, col: 2}, {row: 3, col: 3}
   ];
    const landing = Sample(allSquares, {'replace': false, 'size': pieceCount});
    const shuffle = Sample(allPieces, {'replace': false, 'size': pieceCount});

    var newGameMap = shuffle.map((chip, at) => ({piece: chip, row: landing[at].row, col: landing[at].col })); 
    this.boardMaps = [newGameMap];
    this.resetToMap(0);

    if (!skipLog) {
      console.log('~~:', this.gameState);
      console.log('~~:', this.getGameString());
    }
  }

  // get game string from pieces map
  getGameString() {
    var result = '';
    this.gameState.map(row => row.map(cell => result += cell));
    return result;
  }

  // cycle to generate random solvable levels
  // emit the list of levels found to outter board to place it in the dropdown.
  // levels with more than 20 solutions are not considered (they tend to be way too easy)
  cycleGen(spec: string) {
    this.genLevels = [];
    var counter = 0;
    do {
      this.genSample(true, spec);
      this.startSolver(true);
      if (this.solutions.length && this.solutions.length <= 20) {
        var newGame = this.getGameString();
        console.log('~~ game:', newGame);
        console.log('~~ count:', this.solutions.length);
        this.genLevels.push({levelName: `solutions : ${this.solutions.length}`, gameString: newGame});
      }
    } while (counter++ < 100);
    this.gameString = this.genLevels[0]?.gameString;
    this.setGames.emit(this.genLevels);
  }
}