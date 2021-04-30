const {sortPredictionsInDirectories} = require('./app/sort-and-move-in-dir.js');
const {getAverageRatio, getAverageScore} = require('./app/get-stats.js');

const getStatsAndSort = async (path) => {
  await getAverageScore(path);
  await getAverageRatio(path);
  await sortPredictionsInDirectories(path);
};

getStatsAndSort('./images/');
