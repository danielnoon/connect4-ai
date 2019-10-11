import * as tf from '@tensorflow/tfjs-node';
import { readFileSync } from 'fs';

const data = readFileSync(__dirname + '/../data/moves.json', 'utf-8');
const { moves } = JSON.parse(data) as {
  moves: { board: number[][]; selection: number }[];
};

const flatMoves = moves.map(({ selection, board }) => ({
  selection,
  board: board.flat()
}));

const { inputs, labels } = tf.tidy(() => {
  tf.util.shuffle(flatMoves);

  const inputs = flatMoves.map(d => d.board);
  const labels = flatMoves.map(d => {
    const arr = new Array(6).fill(0);
    arr[d.selection] = 1;
    return arr;
  });

  console.log(labels);

  const inputTensor = tf.tensor2d(inputs, [inputs.length, inputs[0].length]);
  const labelTensor = tf.tensor2d(labels, [labels.length, labels[0].length]);

  return {
    inputs: inputTensor,
    labels: labelTensor
  };
});

async function trainModel(model: tf.LayersModel) {
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ['mse']
  });

  const batchSize = 20;
  const epochs = 300;

  return await model.fit(inputs, labels, {
    batchSize,
    epochs,
    shuffle: true
  });
}

function createModel() {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({
      inputShape: [inputs.shape[1]],
      units: 6,
      useBias: true
    })
  );
  model.add(tf.layers.dense({ units: 6, useBias: true }));

  return model;
}

const testInput = [
  [2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2],
  [2, 2, 2, 2, 2, 2],
  [0, 2, 2, 2, 2, 2],
  [0, 1, 1, 1, 2, 2]
].flat();
const testInputTensor = tf.tensor2d([testInput], [1, testInput.length]);

(async () => {
  const model = createModel();
  await trainModel(model);
  console.log('Trained!');
  const prediction = model.predict(testInputTensor);
  console.log(prediction.toString());
  await model.save('file://' + __dirname + '/../data/model');
  console.log('model saved!');
})();
