import { BoardState } from './BoardState';

export interface Move {
  board: BoardState[][];
  selection: BoardState;
}
