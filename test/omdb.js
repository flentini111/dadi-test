'use strict';

const sinon = require('sinon');
const nock = require('nock');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;

const omdb = require('../src/omdb');

const omdbUrl = /omdbapi\.com/;
const omdbResponse = '{"Title":"Interstellar","Year":"2014","Rated":"PG-13","Released":"07 Nov 2014","Runtime":"169 min","Genre":"Adventure, Drama, Sci-Fi","Director":"Christopher Nolan","Writer":"Jonathan Nolan, Christopher Nolan","Actors":"Ellen Burstyn, Matthew McConaughey, Mackenzie Foy, John Lithgow","Plot":"A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.","Language":"English","Country":"USA, UK","Awards":"Won 1 Oscar. Another 36 wins & 122 nominations.","Poster":"http://ia.media-imdb.com/images/M/MV5BMjIxNTU4MzY4MF5BMl5BanBnXkFtZTgwMzM4ODI3MjE@._V1_SX300.jpg","Metascore":"74","imdbRating":"8.6","imdbVotes":"864,373","imdbID":"tt0816692","Type":"movie","Response":"True"}';

describe('omdb', function () {
    describe('get', function () {
        describe('when the response code is different from 200', function () {
            beforeEach(function() {
                // matches all the requests
                nock(omdbUrl)
                .filteringPath((path) => '/')
                .get('/')
                .reply(404);
            });

            it('should reject the promise', function () {
                const promise = omdb.get({ search: 'interstellar' });
                return expect(promise).to.be.rejected;
            });
        });

        describe('when the request to OMDB api is successful', function () {
            beforeEach(function() {
                // matches all the requests
                nock(omdbUrl)
                .filteringPath((path) => '/')
                .get('/')
                .reply(200, omdbResponse);
            });

            it('should resolve the promise', function () {
                const promise = omdb.get({ id: 'tt0816692' });
                return expect(promise).to.eventually.become(JSON.parse(omdbResponse));
            });
        });
    });
});
