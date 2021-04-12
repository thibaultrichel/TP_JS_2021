const R = require('ramda');
const fs = require('fs-extra');
const path = require('path');

const {getPredictions} = require('./modelPredictions.js');
const {renameImage} = require('./rename.js');

const ensureDir = (x) =>
	R.pipe(
		R.path(['image', 0, 'class']),
		R.concat('./images/'),
		fs.ensureDir,
		R.andThen(R.always(x))
	)(x);

const getAbsolutePath = R.pipe(
	R.prop('path'),
	path.resolve
);

const getNewPath = (x) =>
	R.pipe(
		R.prop('path'),
		R.split('/'),
		R.insert(2, R.path(['image', 0, 'class'], x)),
		R.join('/')
	)(x);

// GPATROUVEMIEU
const moveFile = async (img) => {
	const newPath = getNewPath(img);
	await fs.move(getAbsolutePath(img), newPath);

	return R.assoc('newPath', newPath, img);
};

const sortImage = R.pipe(ensureDir, R.andThen(moveFile));

const sortAndRename = R.pipe(
	sortImage,
	R.andThen(renameImage)
);

const sortPredictionsInDirectories = R.pipe(
	getPredictions,
	R.andThen(R.map(sortAndRename))
);

module.exports = {sortPredictionsInDirectories};
