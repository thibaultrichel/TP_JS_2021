const R = require('ramda');
const sizeOf = require('image-size');
const {getPredictions} = require('./modelPredictions.js');
const {readDir} = require('./rename.js');

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

const getBboxWidth = R.pipe(
	R.path(['image', 0, 'bbox']),
	R.nth(2)
);

const getBboxHeight = R.pipe(
	R.path(['image', 0, 'bbox']),
	R.nth(3)
);

const getBboxSurface = R.pipe(
	R.converge(R.multiply, [getBboxWidth, getBboxHeight])
);

const getRatio = R.pipe(
	R.converge(R.divide, [getBboxSurface, getImgSurface])
);

const TEST = R.pipe(
	getPredictions,
	R.andThen(R.map(getRatio)),
	R.andThen(R.tap(console.log))
);

TEST('./images/');
