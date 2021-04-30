const R = require('ramda');
const fs = require('fs-extra');

const isHiddenFile = R.pipe(R.nth(0), R.equals('.'), R.not);

const readDir = (path) =>
	R.pipe(
		fs.readdir,
		R.andThen(R.filter(isHiddenFile)),
		R.andThen(R.map(R.concat(path)))
	)(path);

const getPathWithoutName = R.pipe(
	R.split('/'),
	R.init,
	R.join('/'),
	R.flip(R.concat)('/')
);

const getCompteur = R.pipe(
	getPathWithoutName,
	fs.readdirSync,
	R.filter(isHiddenFile),
	R.length,
	R.toString
);

const getExtension = R.pipe(
	R.split('/'),
	R.last,
	R.split('.'),
	R.nth(1),
	R.concat('.')
);

const getImgClass = R.pipe(R.split('/'), R.nth(2));

const getImgNewName = R.pipe(R.converge(R.concat, [getImgClass, getCompteur]));

const getNewImgWithExt = R.pipe(
	R.converge(R.concat, [getImgNewName, getExtension])
);

const getRenamedPath = R.pipe(
	R.prop('newPath'),
	R.converge(R.concat, [getPathWithoutName, getNewImgWithExt])
);

const renameImage = R.pipe(
	R.converge(fs.rename, [R.prop('newPath'), getRenamedPath])
);

module.exports = {renameImage, readDir};
