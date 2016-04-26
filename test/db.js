'use strict';

const sinon = require('sinon');
const chai = require('chai');
chai.use(require('chai-as-promised'));
const expect = chai.expect;
const fs = require('fs');

const db = require('../src/db');

describe('db', function () {
    const sandbox = sinon.sandbox.create();

    beforeEach(function () {
        this.config = {
            cache: {
                max: 100,
                maxAge: 60000
            }
        };

        this.omdb = {
            get: sandbox.stub()
        };

        this.dataset = [];

        this.logger = {
            error: sandbox.stub()
        };

        this.db = db(this.config, this.omdb, this.dataset, this.logger);
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('get', function () {
        const filmDetails = {
            imdbID: 'movieId',
            Title: 'Film title',
            Year: '2015',
            Released: '2 May 2015',
            Director: 'The Director',
            Poster: 'http://poster.url',
            Plot: 'Film plot',
            Runtime: '150 min',
            imdbRating: '6.2'
        };

        beforeEach(function () {
            this.omdb.get.returns(Promise.resolve(filmDetails));
        });

        it('should return the film details', function () {
            return expect(this.db.get('Film title')).to.eventually.become(this.db.model(filmDetails));
        });

        it('should cache the results', function () {
            this.db.get('Film title');
            this.db.get('Film title');

            sinon.assert.calledOnce(this.omdb.get);
        });
    });

    describe('search', function () {
        const searchResults = {
            Search: [
                {
                    imdbID: 'movieId 1',
                    title: 'Film title 1'
                },
                {
                    imdbID: 'movieId 2',
                    title: 'Film title 2'
                }
            ]
        };

        beforeEach(function () {
            this.omdb.get.returns(Promise.resolve(searchResults));
        });

        it('should return the search results', function () {
            return expect(this.db.search('Film title')).to.eventually.become(searchResults.Search);
        });
    });

    describe('getPopular', function () {
    });

    describe('getMostReadReviews', function () {

    });

    describe('model', function () {

    });
});
