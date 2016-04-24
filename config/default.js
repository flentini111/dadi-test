'use strict';

module.exports = {
    port: 9999,
    apiVersion: 0,
    db: {
        cache: {
            // max number of movies in cache
            maxAge: 1000,
            // objects life in cache (10 mins)
            max: 1000 * 60 * 10
        }
    }
};
