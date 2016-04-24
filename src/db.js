'use strict';

const AsyncCache = require('async-cache');
const fs = require('fs');

function db (config, omdb) {
    const reviews = JSON.parse(fs.readFileSync('./data/reviews.json', {encoding: 'utf-8'}));
    const cache = new AsyncCache({
        name: 'db',
        load: (params, callback) => {
            omdb.get(params).then((film) => {
                callback(null, film);
            }).catch((err) => {
                callback(err);
            });
        },
        max: config.cache.max,
        maxAge: config.cache.maxAge
    });

    /**
     * @param {String} id film id
     * @return {Promise} resolves with the film details plus the reviews if present
     */
    function get (id) {
        return new Promise((resolve, reject) => {
            if (!id) {
                reject('a film id must be provided');
            }

            cache.get({id: id}, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    if (result.Response == 'True' && result.imdbID) {
                        result.reviews = getReviews(result.imdbID);
                    }

                    resolve(result);
                }
            });
        });
    }

    /**
     * @param {String} query search string
     * @return {Promise} resolves with a result array
     */
    function search (query) {
        return new Promise((resolve, reject) => {
            if (!query) {
                reject('a search query must be provided');
            }

            cache.get({search: query}, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    result = result.Search;

                    resolve(result);
                }
            });
        });
    }

    /**
     * @param {string} optional film id
     * @return {Array|Object} id's reviews or all the reviews in the collection
     */
    function getReviews (id) {
        if (!id) {
            return reviews;
        }

        if(id && reviews.hasOwnProperty(id)) {
            return reviews[id];
        } else {
            return [];
        }
    }

    return {
        get: get,
        search: search,
        getReviews: getReviews
    };
}

module.exports = db;
