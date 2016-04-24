'use strict';
const winston = require('winston');

function logger (config) {
    const logger = new winston.Logger({
        transports: [
            new winston.transports.Console({
                level: 'debug',
                colorize: true
            }),
            new winston.transports.File({
                level: 'info',
                filename: config.filename,
                maxsize: config.maxsize,
                colorize: false
            })
        ]
    });

    return {
        logger: logger,
        stream: {
            write: (message) => {
                logger.info(message);
            }
        }
    };
}

module.exports = logger;

