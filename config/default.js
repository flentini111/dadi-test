'use strict';

module.exports = {
    port: 9999,
    apiVersion: 0,
    db: {
        cache: {
            // max number of movies in cache
            max: 1000,
            // objects life in cache (10 mins)
            maxAge: 1000 * 60 * 10
        }
    },
    log: {
        maxsize: 2000000,
        filename: './logs/main.log'
    }
};
