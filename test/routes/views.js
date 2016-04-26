'use strict';

const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
const express = require('express');
const supertest = require('supertest');

const routes = require('../../src/routes/views');

module.exports = () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(function () {
        this.db = {
            get: sandbox.stub(),
            getPopular: sandbox.stub(),
            getMostReadReviews: sandbox.stub()
        };

        this.logger = sandbox.stub();

        this.templates = {
            index: sandbox.stub().callsArg(1),
            film: sandbox.stub().callsArg(1),
            films: sandbox.stub().callsArg(1),
            review: sandbox.stub().callsArg(1),
            reviews: sandbox.stub().callsArg(1),
            profile: sandbox.stub().callsArg(1)
        };

        this.app = express();
        this.router = express.Router();
        this.routes = routes(this.router, this.db, this.templates, this.logger);

        this.app.use(this.routes);
        this.agent = supertest.agent(this.app);
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('/', function () {
        it('should load the index template', function (done) {
            this.agent.get('/')
            .expect(200)
            .expect((response) => {
                sinon.assert.calledOnce(this.templates.index);
            }).end(done);
        });

        it('should pass the template data from the db', function (done) {
            this.agent.get('/')
            .expect(200)
            .expect((response) => {
                sinon.assert.calledOnce(this.db.getPopular);
                sinon.assert.calledWith(this.db.getPopular, 4);

                sinon.assert.calledOnce(this.db.getMostReadReviews);
                sinon.assert.calledWith(this.db.getMostReadReviews, 2);
            }).end(done);
        });
    });

    describe('/film/:id', function () {
        const film = {title: 'The Film'};

        beforeEach(function () {
            this.db.get.returns(Promise.resolve(film));
        });

        it('should load the film template', function (done) {
            this.agent.get('/film/thefilmid')
            .expect(200)
            .expect((response) => {
                sinon.assert.calledOnce(this.templates.film);
            }).end(done);
        });

        it('should pass the template data from the db', function (done) {
            this.agent.get('/film/thefilmid')
            .expect(200)
            .expect((response) => {
                sinon.assert.calledOnce(this.db.get);
                sinon.assert.calledWith(this.db.get, 'thefilmid');

                sinon.assert.calledOnce(this.db.getMostReadReviews);
                sinon.assert.calledWith(this.db.getMostReadReviews, 2, film);
            }).end(done);
        });
    });

    describe('/films', function () {
        it('should load the films template', function (done) {
            this.agent.get('/films')
            .expect(200)
            .expect((response) => {
                sinon.assert.calledOnce(this.templates.films);
            }).end(done);
        });

        it('should pass the template data from the db', function (done) {
            this.agent.get('/films')
            .expect(200)
            .expect((response) => {
                sinon.assert.calledOnce(this.db.getPopular);
                sinon.assert.calledWith(this.db.getPopular, 30);
            }).end(done);
        });
    });

    describe('/review/:id', function () {
        // TODO tests
    });

    describe('/reviews', function () {
        // TODO tests
    });

    describe('/profile', function () {
        // TODO tests
    });
};
