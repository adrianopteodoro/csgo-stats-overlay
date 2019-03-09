const logger = require('../helpers/logger');
const db = require('../helpers/db');

const updatestats = async (params) => {
    logger.debug(`RECEIVED: ${JSON.stringify(params)}`)
    db.insert(params);
    return 'OK!';
};

module.exports = [{
    route: '/updatestats',
    http: {
        post: updatestats
    },
}, ];