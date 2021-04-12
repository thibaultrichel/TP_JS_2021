const R = require('ramda');
const fs = require('fs-extra');

const getCompteur = R.pipe(
	fs.readdir,
	R.andThen(R.length),
	R.andThen(R.toString),
	R.andThen(R.tap(console.log))
);

const getExtension = R.pipe(
	R.split('/'),
	R.last,
	R.split('.'),
	R.nth(1),
	R.concat('.')
);

const getClass = R.pipe(R.split('/'), R.nth(2));

const getImgNewName = R.pipe(
	R.converge(R.concat, [getClass, getCompteur])
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

const getRenamedPath = R.pipe(
	R.prop('newPath'),
	R.converge(R.concat, [
		getPathWithoutName,
		getNewImgWithExt
	])
);

const setNewPath = (x) =>
	R.pipe(
		R.set(R.lensProp('newPath'), getRenamedPath(x)),
		R.tap(console.log)
	)(x);

const renameImage = R.pipe(
	R.converge(fs.rename, [R.prop('newPath'), getRenamedPath])
);

module.exports = {renameImage};
