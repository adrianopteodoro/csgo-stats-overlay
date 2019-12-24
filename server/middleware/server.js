/**
 * Created by Adriano on 25/02/2017.
 */
const express = require('express');
const bodyParser = require('body-parser');
const chalk = require('chalk');
const router = require('./router');
const logger = require('../helpers/logger');

class Server {
    constructor(appDir) {
        this.app = express();
        this.port = 3000;

        this.ip = '0.0.0.0';
        this.app.dir = appDir;
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(express.static(`${this.app.dir}/client/public`));
    }

    getAddress() {
        return `http://${this.ip === '0.0.0.0' ? '127.0.0.1':this.ip}:${this.port}`;
    }

    setIp(newIp) {
        this.ip = newIp;
    }

    setPort(newPort) {
        this.port = newPort;
    }

    start() {
        this.app.listen(this.port, this.ip, () => {
            const host = chalk.yellow(`${this.getAddress()}`);
            const type = chalk.red('HTTP SERVER');
            logger.info(`${type} => Listening at ${host}`);
        });
    }

    get() {
        return this.app;
    }

    serveRoutes(routes) {
        router.initializeUsing(routes);
        this.app.use('/api/v1', router.get());
    }
}

module.exports = Server;
