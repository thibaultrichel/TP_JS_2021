const R = require('ramda');
const fs = require('fs-extra');

const getCompteur2 = () => {
	return '0';
};

const getExtension = R.pipe(
	R.split('/'),
	R.last,
	R.split('.'),
	R.nth(1),
	R.concat('.')
);

const getImgNewName = R.pipe(
	R.split('/'),
	R.last,
	R.split('.'),
	R.converge(R.concat, [R.nth(0), getCompteur2])
);

const getPathWithoutName = R.pipe(
	R.split('/'),
	R.init,
	R.join('/'),
	R.flip(R.concat)('/')
);

const getNewImgWithExt = R.pipe(
	R.converge(R.concat, [getImgNewName, getExtension])
);

const renameImage = R.pipe(
	R.prop('path'),
	R.converge(R.concat, [getPathWithoutName, getNewImgWithExt])
);

module.exports = {renameImage};
