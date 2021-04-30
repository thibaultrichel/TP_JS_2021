const {sortPredictionsInDirectories} = require('./sortAndMoveInDir.js');
const {getAverageRatio, getAverageScore} = require('./getStats.js');

const getStatsAndSort = async (path) => {
	await getAverageScore(path);
	await getAverageRatio(path);
	await sortPredictionsInDirectories(path);
};

getStatsAndSort('./images/');
