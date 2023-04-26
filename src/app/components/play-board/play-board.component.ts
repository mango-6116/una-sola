import { Component, Input, OnInit } from '@angular/core';
import * as CT from 'js-combinatorics';
import Sample from '@stdlib/random-sample';
import  JSConfetti  from 'js-confetti';


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

  gameState: string[][] = [];
  _gameString: string = '';
  @Input() set gameString(val: string) {
    if (!!val) {
      if (val == 'solve') {
      // intialize brute force solver:
        this.startSolver();
      }else if (val == 'gen') {
        // intialize random gen:
        this.genSample();
      }else if (val == 'cycle') {
        this.cycleGen();
      } else {
        this._gameString = val;
        this.setGameState(val);
      }
    }
  };

  get gameString(): string {
    return this._gameString;
  }

  boardMaps: boardPiece[][] = [];
  mapId = 0;
  moveTracker: any[] = [];
  solutions: any[] = [];
  pendingChecks = true;
  confettiSize = 32;

  constructor() {
  }

  ngOnInit() {
    if (!window['js-confetti']) {

      const setConfettiSize = (isPortrait: boolean) => this.confettiSize = isPortrait ? 64 : 32;

      // Create the query list.
      const mediaQueryList = window.matchMedia("(orientation: portrait)");
      setConfettiSize(mediaQueryList.matches);

      // Define a callback function for the event listener.
      const handleOrientationChange = (mql: MediaQueryListEvent) => {
        setConfettiSize(mql.matches);
      }

      // Add the callback function as a listener to the query list.
      mediaQueryList.addEventListener("change", handleOrientationChange);

      const canvas = document.getElementById('party') as HTMLCanvasElement;
      window['js-confetti'] = new JSConfetti({canvas});
    }
  }

  // Play code...
  ///////////////////////////////////

  setGameState(val: string) {
    this.gameState = []
    var gameString = val.split(' ').join('');
    for (let r = 0; r <= 3; r++) {
      const rowString = gameString.substr(r*4, 4);
      this.gameState[r] = [];
      for (let c = 0; c <= 3; c++) {
        this.gameState[r][c] = rowString.charAt(c);
      }
    }
  }

  checkDrop(ev: any) {
    const mFrom = ev.previousContainer.element.nativeElement.id.split('-');
    const mTo = ev.container.element.nativeElement.id.split('-');
    this.makeMove(
      {row: +mFrom[1], col: +mFrom[2]}, 
      {row: +mTo[1], col: +mTo[2]}
    );
  }

  makeMove(from: moveStep, to: moveStep) {
    if (this.tryStep(from, to) == 1) {
      this.pop();
    }
  }

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

  addCheckPoints(pieces: boardPiece[], index: number | null) {
    this.boardMaps.push(pieces);
    var mapId = this.boardMaps.length -1;
    this.moveTracker.push(...(this.findMoves(this.boardMaps[mapId]))
      .map(element => ({...element, result: null, mapId: mapId, prevIndex: index})));
  }

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

  resetToMap(index: number) {
    this.setGameState('.... .... .... ....');
    this.boardMaps[index].forEach(chip => 
      this.gameState[chip.row][chip.col] = chip.piece
    );
  }

  findMoves(boardPieces: boardPiece[]) {
    var it =  new CT.Permutation(boardPieces, 2);
    return it.toArray();
  }

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

  genSample(skipLog = false) {
    this.setGameState('.... .... .... ....')
    const allPieces = ['R', 'K', 'B', 'B', 'N', 'N', 'P', 'P', 'P', 'P'];
    const allSquares = [
      {row: 0, col: 0}, {row: 0, col: 1}, {row: 0, col: 2}, {row: 0, col: 3},
      {row: 1, col: 0}, {row: 1, col: 1}, {row: 1, col: 2}, {row: 1, col: 3}, 
      {row: 2, col: 0}, {row: 2, col: 1}, {row: 2, col: 2}, {row: 2, col: 3}, 
      {row: 3, col: 0}, {row: 3, col: 1}, {row: 3, col: 2}, {row: 3, col: 3}
   ];
    const landing = Sample(allSquares, {'replace': false, 'size': 7});
    const shuffle = Sample(allPieces, {'replace': false, 'size': 7});

    var newGameMap = shuffle.map((chip, at) => ({piece: chip, row: landing[at].row, col: landing[at].col })); 
    this.boardMaps = [newGameMap];
    this.resetToMap(0);

    if (!skipLog) {
      console.log('~~:', this.gameState);
      console.log('~~:', this.getGameString());
    }
  }

  getGameString() {
    var result = '';
    this.gameState.map(row => row.map(cell => result += cell));
    return result;
  }

  cycleGen() {
    var counter = 0;
    do {
      this.genSample(true);
      this.startSolver(true);
      if (this.solutions.length && this.solutions.length <= 20) {
        console.log('~~ game:', this.getGameString());
        console.log('~~ count:', this.solutions.length);
      }
    } while (counter++ < 100);
  }
}