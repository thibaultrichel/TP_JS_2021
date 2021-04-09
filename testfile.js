const R = require('ramda');
const fs = require('fs-extra');
const path = require('path');

const {getPredictions} = require('./index.js');

const getCompteur = R.pipe(
    fs.readdir,
    R.andThen(R.length),
    R.andThen(R.toString),
    R.andThen(R.tap(console.log)) // ?????
);

const getCompteur2 = () => {return '0'}

const getImgNewName = R.pipe(
    R.split('/'),
    R.last,
    R.split('.'),
    R.converge(R.concat, [R.nth(0), getCompteur2])
);

const renameImage = (img) =>
    R.pipe(     // prends une image
        R.prop('path'),
        getImgNewName,
        R.concat(R.prop('path', img))
    )(img);

const renameTEST = R.pipe(
    getPredictions,
    R.andThen(R.nth(0)),
    R.andThen(renameImage),
    R.andThen(R.tap(console.log))
);

// giga teub

renameTEST();
