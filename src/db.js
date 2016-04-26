'use strict';

const AsyncCache = require('async-cache');

function db (config, omdb, dataset, logger) {
    // sort the records by imdb rating and apply the model function to each of them
    dataset = dataset.sort((a,b) => parseInt(b.imdbVotes) - parseInt(a.imdbVotes))
    .map(filmModel);

    const cache = new AsyncCache({
        load: (params, callback) => {
            // lru cache checks for identity if objects are used as keys, that's why I am serializing the argument and deserializing it here
            // Needs to be improved!
            omdb.get(JSON.parse(params)).then((film) => {
                callback(null, film);
            }).catch((err) => {
                callback(err);
            });
        },
        max: config.cache.max,
        maxAge: config.cache.maxAge
    });

    /**
     * @param {Object} rawData film entry coming from the dataset
     * @return {Object}
     */
    function filmModel (rawData) {
        return {
            ID : rawData.imdbID,
            title: rawData.Title,
            year: rawData.Year,
            released: rawData.Released,
            director: rawData.Director,
            poster: rawData.Poster,
            plot: rawData.Plot,
            reviews: rawData.reviews || [],
            runtime: rawData.Runtime,
            rating: rawData.imdbRating
        };
    }

    /**
     * @param {String} id film id
     * @return {Promise} resolves with the film details plus the reviews if present
     */
    function get (id) {
        return new Promise((resolve, reject) => {
            const film = dataset.filter((entry) => entry.ID === id)[0];
            // return the film if it's on our local datastore
            if (film) {
                resolve(film);
            } else {
                // otherwise query omdb for the details
                cache.get(JSON.stringify({id: id}), (err, result) => {
                    if (err) {
                        logger.error(err);
                        reject(err);
                    } else {
                        resolve(filmModel(result));
                    }
                });
            }
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

            cache.get(JSON.stringify({search: query}), (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result.Search || result);
                }
            });
        });
    }

    /**
     * @param {number} howmany How many reviews to return
     * @param {Array|Object} list Film or List of films from which extract most read reviews.
     * @return {Array} array of reviews sorted by number of views
     */
    function getMostReadReviews (howmany, list) {
        list = list || dataset;

        if(!Array.isArray(list)) {
            list = [list];
        }

        const result = list.reduce((reviews, film) => {
            return reviews.concat(film.reviews.map((review) => {
                // add a reference to the film poster to every review
                review.poster = film.poster;
                return review;
            }));
        }, []).sort((a, b) => {
            return b.meta.views - a.meta.views;
        });

        return howmany >= result.length ? result : result.slice(0, howmany);
    }

    /**
     * returns the top popular films. The fake dataset is already sorted by rating.
     *
     * @param {number} howmany How many top items to return
     * @return {Array}
     */
    function getPopular (howmany) {
        return howmany >= dataset.length ? dataset : dataset.slice(0, howmany);
    }

    return {
        get: get,
        search: search,
        getPopular: getPopular,
        getMostReadReviews : getMostReadReviews,
        model: filmModel
    };
}

module.exports = db;
