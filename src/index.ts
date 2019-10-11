import { Connect4 } from './Connect4';
import { BoardState } from './BoardState';
import * as tf from '@tensorflow/tfjs-node';
import { createInterface } from 'readline';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(
  'Instructions: Press the number of the column you wish to place your piece in.'
);
console.log(
  "The game does not currently check for wins. You'll have to do that on your own."
);
console.log('To quit or complete a game, press "q".\n');

(async () => {
  const model = await tf.loadLayersModel(
    'file://' + __dirname + '/../data/model/model.json'
  );

  const game = new Connect4(model);
  game.initializeBoard();
  console.log(game.printBoard());
  function prompt() {
    // console.log('\nPlayer ' + (currentUser === BoardState.USER ? '1' : '2'));
    rl.question('Next place? ', input => {
      if (input === 'q') {
        console.log('Thanks for your help!');
        process.exit(0);
      }
      const column = parseInt(input);
      game.place(BoardState.USER, column);
      const computerChoice = game.pickNextMove();
      game.place(BoardState.COMPUTER, computerChoice + 1);
      console.log('\n' + game.printBoard() + '\n');
      prompt();
    });
  }
  prompt();
})();
