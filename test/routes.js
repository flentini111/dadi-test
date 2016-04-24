'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const express = require('express');
const supertest = require('supertest');

const routes = require('../src/routes/api');
const apiVersion = 0;

describe('routes', function () {
    const sandbox = sinon.sandbox.create();

    beforeEach(function () {
        this.db = {
            get: sandbox.stub(),
            search: sandbox.stub(),
            getReviews: sandbox.stub()
        };

        this.logger = sandbox.stub();

        this.app = express();
        this.router = express.Router();
        this.routes = routes(this.router, this.db, this.logger);

        this.app.use(`/api/${apiVersion}`, this.routes);
        this.agent = supertest.agent(this.app);
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('api', function () {
        describe('/films', function () {
            describe('get', function () {
                describe('when the id argument is passed', function () {
                    const filmDetails = {
                        imdbID: 'filmid',
                        Title: 'Film Title'
                    };

                    beforeEach(function () {
                        this.db.get.returns(Promise.resolve(filmDetails));
                    });

                    it('should return the film resource', function (done) {
                        this.agent
                        .get(`/api/${apiVersion}/films/filmid`)
                        .expect(200)
                        .expect(function (response) {
                            expect(response.body).to.have.property('Title')
                            .equal(filmDetails.Title);
                        })
                        .end(done);
                    });
                });

                describe('when the id argument is not passed', function () {
                    it('should return the latest films', function () {
                    });
                });
            });

            describe('post', function () {
                it('should create a new film resource', function () {

                });
            });
        });

        describe('/search', function () {
            describe('when the query is shorter than 3 characters', function() {
                it('should return no content', function (done) {
                    this.agent
                    .get(`/api/${apiVersion}/search`)
                    .query({s: 'xy'})
                    .expect(204, done);
                });
            });

            describe('when the query is 3 characters or longer', function () {
                const searchResult = [
                    {
                        Title: 'Movie 1',
                        imdbID: 'xyz123'
                    },
                    {
                        Title: 'Movie 2',
                        imdbID: 'xyz124'
                    },
                    {
                        Title: 'Movie 3',
                        imdbID: 'xyz125'
                    }
                ];
                beforeEach(function () {
                    this.db.search.returns(Promise.resolve(searchResult));
                });

                it('should return the search results', function (done) {
                    this.agent
                    .get(`/api/${apiVersion}/search`)
                    .query({s: 'xyz'})
                    .expect(200)
                    .expect(function (response) {
                        expect(response.body).to.be.deep.equal(searchResult);
                    }).end(done);
                });
            });
        });

        describe('/user', function () {
            // TODO
        });

        describe('/reviews', function () {
            // TODO
        });
    });
});
