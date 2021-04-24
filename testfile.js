const R = require('ramda');
const fs = require('fs-extra');
const sizeOf = require('image-size');

const {getPredictions} = require('./modelPredictions.js');

const getBbox = R.pipe(
	R.path(['image', 0, 'bbox']),
	R.tap(console.log)
);

const getDimensions = R.pipe(
	R.prop('path'),
	sizeOf,
	R.dissoc('type'),
	R.dissoc('orientation'),
	R.tap(console.log)
);

const displayBbox = R.pipe(
	getPredictions,
	R.andThen(R.map(getBbox))
);

const displayDimensions = R.pipe(
	getPredictions,
	R.andThen(R.map(getDimensions))
);

displayBbox('./images/');
displayDimensions('./images/');
