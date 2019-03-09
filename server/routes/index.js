const fs = require('fs');
const logger = require('../helpers/logger');

const loadRouteFromFile = (filename) => {
    try {
        const fileRoute = require(`./${filename}`); //eslint-disable-line
        return fileRoute;
    } catch (error) {
        logger.error(error);
        return [];
    }
};

const getRoute = () => {
    const flattenBase = (array, Route) => array.concat(Route);
    try {
        const files = fs.readdirSync(__dirname);
        const filesWithNoIndex = files.filter(file => file !== 'index.js');

        const Route = filesWithNoIndex.map(loadRouteFromFile)
            .reduce(flattenBase, []);

        return Route;
    } catch (error) {
        logger.error(error);
        return [];
    }
};

module.exports = getRoute;