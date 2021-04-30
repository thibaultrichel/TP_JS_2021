const {getPredictions} = require('./model-predictions.js');
const sizeOf = require('image-size');
const R = require('ramda');

const getClass = R.pipe(R.path(['image', 0, 'class']));

const getScore = R.pipe(R.path(['image', 0, 'score']));

const getImgWidth = R.pipe(
  R.prop('path'),
  sizeOf,
  R.dissoc('type'),
  R.dissoc('orientation'),
  R.prop('width')
);

const getImgHeight = R.pipe(
  R.prop('path'),
  sizeOf,
  R.dissoc('type'),
  R.dissoc('orientation'),
  R.prop('height')
);

const getImgSurface = R.pipe(
  R.converge(R.multiply, [getImgWidth, getImgHeight])
);

const getBboxWidth = R.pipe(R.path(['image', 0, 'bbox']), R.nth(2));

const getBboxHeight = R.pipe(R.path(['image', 0, 'bbox']), R.nth(3));

const getBboxSurface = R.pipe(
  R.converge(R.multiply, [getBboxWidth, getBboxHeight])
);

const getRatio = R.pipe(R.converge(R.divide, [getBboxSurface, getImgSurface]));

const createObjectToWrite = (img) =>
  R.pipe(
    getClass,
    R.objOf('class'),
    R.assoc('score', getScore(img)),
    R.assoc('ratio', getRatio(img))
  )(img);

const getStats = R.pipe(getPredictions, R.andThen(R.map(createObjectToWrite)));

const getAverageRatio = R.pipe(
  getStats,
  R.andThen(R.map(R.prop('ratio'))),
  R.andThen(R.mean),
  R.andThen(R.toString),
  R.andThen(R.concat('averageRatio : ')),
  R.andThen(R.tap(console.log))
);

const getAverageScore = R.pipe(
  getPredictions,
  R.andThen(R.map(R.path(['image', 0, 'score']))),
  R.andThen(R.mean),
  R.andThen(R.toString),
  R.andThen(R.concat('averageScore : ')),
  R.andThen(R.tap(console.log))
);

module.exports = {getAverageRatio, getAverageScore};
