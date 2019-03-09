const {
    createLogger,
    transports,
    format
} = require('winston');
const chalk = require('chalk');

const {
    printf,
    combine,
    timestamp,
    label,
} = format;

const getLevelColor = (level) => {
    const upLevel = level.toUpperCase();
    switch (upLevel) {
        case 'INFO':
            return chalk.cyan(upLevel);
        case 'DEBUG':
            return chalk.green(upLevel);
        case 'WARN':
            return chalk.yellow(upLevel);
        case 'ERROR':
            return chalk.red(upLevel);
        default:
            return upLevel;
    }
};

const consoleFormat = printf((info) => {
    const level = getLevelColor(info.level);
    const labelName = info.label.toUpperCase();
    return `${info.timestamp} [${labelName}] ${level}: ${info.message}`;
});

const consoleOptions = {
    colorize: false,
    json: false,
};
const labelSet = label({
    label: process.env.NODE_ENV || 'development'
});
const logFormat = combine(labelSet, timestamp(), consoleFormat);
const logLevel = process.env.NODE_ENV === 'production' ? 'info' : 'debug';
const logger = createLogger({
    level: logLevel,
    format: logFormat,
    transports: [new transports.Console(consoleOptions)],
});

module.exports = logger;