'use strict';

/**
* @module Omdb Open Movie Database API wrapper
*/

const request = require('request');
const apiUrl = 'http://www.omdbapi.com/?t={{title}}&y=&plot=short&r=json&type=movie';

const requestBody = {
    url: 'http://www.omdbapi.com',
    qs: {
        type: 'movie'
    }
};

/**
 * Performs a get request to the API
 *
 * @function
 * @param {Object} params
 * @param {String} params.id the movie id
 * @param {String} params.search string search
 * @return {Promise} resolves with the id details or search results. Gets rejected if an error occurs.
 */
function get (params) {
    if (params.id) {
        requestBody.qs.i = params.id;
    } else if (params.search) {
        requestBody.qs.s = params.search;
    }

    return new Promise((resolve, reject) => {
        request(requestBody, function getResult(err, response, body) {
            if (err || response.statusCode !== 200) {
                reject(err || response);
            } else {
                resolve(JSON.parse(body));
            }
        });
    });
}

module.exports = {
    get: get
};
