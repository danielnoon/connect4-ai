import rl from 'readline-sync';
import { Connect4 } from './Connect4';
import { BoardState } from './BoardState';

const game = new Connect4();
game.initializeBoard();
console.log(game.printBoard());
let currentUser: BoardState = BoardState.USER;
while (true) {
  console.log('\nPlayer ' + (currentUser === BoardState.USER ? '1' : '2'));
  const input = rl.question('Next place? ');
  if (input === 'q') {
    console.log('Thanks for your help!');
    process.exit(0);
  }
  const column = parseInt(input);
  game.place(currentUser, column);
  console.log('\n' + game.printBoard() + '\n');
  currentUser =
    currentUser === BoardState.USER ? BoardState.COMPUTER : BoardState.USER;
}
