// eslint-disable-next-line import/no-unassigned-import
require('@tensorflow/tfjs-node');
const cocoSsd = require('@tensorflow-models/coco-ssd');
const fs = require('fs-extra');
const jpeg = require('jpeg-js');
const Bromise = require('bluebird');
const R = require('ramda');
const {readDir} = require('./rename.js');

const detectImage = (model) =>
  R.pipe(
    R.over(R.lensProp('image'), (x) => model.detect(x)),
    Bromise.props
  );

const readJpg_ = async (path) => jpeg.decode(await fs.readFile(path), true);

const reader = (path) =>
  R.pipe(
    readJpg_,
    R.andThen(R.objOf('image')),
    R.andThen(R.assoc('path', path))
  )(path);

const getPredictions = async (pathToDir) => {
  const imgList = await Bromise.map(readDir(pathToDir), reader);

  // Load the model.
  const model = await cocoSsd.load();

  // Classify the image.
  const predictions = await Bromise.map(imgList, detectImage(model));

  return predictions;
};

module.exports = {getPredictions};
