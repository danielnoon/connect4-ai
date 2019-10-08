import { BoardState } from './BoardState';
import { readFileSync, writeFile, writeFileSync } from 'fs';
import { Move } from './Move.model';

export class Connect4 {
  board: BoardState[][] = [];
  currentMoveData: Move[];

  constructor() {
    try {
      const data = readFileSync(__dirname + '/../data/moves.json', 'utf-8');
      this.currentMoveData = (JSON.parse(data) as { moves: Move[] }).moves;
    } catch {
      writeFileSync(__dirname + '/../data/moves.json', '{ "moves": [] }');
      this.currentMoveData = [];
    }
  }

  initializeBoard() {
    for (let i = 0; i < 6; i++) {
      this.board[i] = [];
      for (let j = 0; j < 6; j++) {
        this.board[i][j] = BoardState.EMPTY;
      }
    }
  }

  place(player: BoardState, position: number) {
    let bottomOpenRow = this.board.length - 1;
    while (
      bottomOpenRow >= 0 &&
      this.board[bottomOpenRow][position - 1] !== BoardState.EMPTY
    ) {
      bottomOpenRow--;
    }
    if (bottomOpenRow < 0) {
      return false;
    } else {
      this.saveMove(player, position - 1);
      this.board[bottomOpenRow][position - 1] = player;
      return true;
    }
  }

  printBoard() {
    return (
      this.board
        .map(
          r =>
            '| ' +
            r
              .map(c => {
                if (c === BoardState.COMPUTER) {
                  return 'x';
                } else if (c === BoardState.USER) {
                  return 'o';
                } else {
                  return ' ';
                }
              })
              .join(' ') +
            ' |'
        )
        .join('\n') +
      '\n  ' +
      new Array(6)
        .fill(0)
        .map((j, i) => i + 1)
        .join(' ')
    );
  }

  saveMove(player: BoardState, column: number) {
    let move: Move = {
      board: this.board.map(r =>
        r.map(c => {
          if (player === BoardState.USER) {
            if (c === BoardState.COMPUTER) {
              return BoardState.USER;
            } else if (c === BoardState.USER) {
              return BoardState.COMPUTER;
            } else {
              return BoardState.EMPTY;
            }
          } else {
            return c;
          }
        })
      ),
      selection: column
    };
    this.currentMoveData.push(move);
    const content = JSON.stringify({ moves: this.currentMoveData.flat() });
    writeFileSync(__dirname + '/../data/moves.json', content);
  }
}
