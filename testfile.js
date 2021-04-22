const R = require('ramda');
const fs = require('fs-extra');
const path = require('path');
const {getImgNewName} = require('./rename.js');

const {getPredictions} = require('./modelPredictions.js');

const isHiddenFile = R.pipe(R.nth(0), R.equals('.'), R.not);

const getPath = R.pipe(
	path.resolve,
	R.split('/'),
	R.insert(5, 'images'),
	R.join('/'),
	R.tap(console.log)
);

const readDir = (path) => {
	return [
		'./images/cat.jpeg',
		'./images/dog.jpeg',
		'./images/little-red-panda.jpeg',
		'./images/panda.jpeg'
	];
};

const test = R.pipe(
	getPredictions,
	R.andThen(getImgNewName)
);

test();
