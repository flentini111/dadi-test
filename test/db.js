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

        this.db = db(this.config, this.omdb);
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('get', function () {
        const filmDetails = {
            imdbID: 'movieId',
            title: 'Film title'
        };

        beforeEach(function () {
            this.omdb.get.returns(Promise.resolve(filmDetails));
        });

        it('should return the film details', function () {
            return expect(this.db.get('Film title')).to.eventually.become(filmDetails);
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

    describe('getReviews', function () {
        describe('when no id is provided', function () {
            it('should return all the reviews in the collection', function () {
                expect(this.db.getReviews()).to.be.an('object');
            });
        });

        describe('when an id is provided', function () {
            describe('but no reviews are present', function () {
                it('should return an empty array', function () {
                    expect(this.db.getReviews('movieId')).to.be.instanceof(Array).and.to.be.empty;
                });
            });

            describe('and reviews are present', function () {
                beforeEach(function () {
                    const reviews = {
                        movieId: [{
                            author: 'review author',
                            title: 'review title',
                            content: 'review content'
                        }]
                    };

                    // I cheated by stubbing the fs module. In a real application the reviews should come from a db, easier to test.

                    sandbox.stub(fs, 'readFileSync', function () {
                        return JSON.stringify(reviews);
                    });

                    this.db = db(this.config, this.omdb);
                });

                it('should return a list of reviews', function () {
                    expect(this.db.getReviews('movieId')).to.be.instanceof(Array).and.to.have.deep.property('[0].author', 'review author');
                });
            });
        });
    });
});
