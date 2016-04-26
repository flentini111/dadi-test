'use strict';

const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const omdb = require('./src/omdb');
const logger = require('./src/logger')(config.log);

// fake dataset injected into the db interface
const dataset = JSON.parse(require('fs').readFileSync('./data/dataset.json', {encoding: 'utf-8'}));

const db = require('./src/db')(config.db, omdb, dataset, logger.logger);
const routes = require('./src/routes');
const templates = require('./src/templates');

const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(morgan('combined', {stream: logger.stream}));

// register routes
app.use(`/api/${config.apiVersion}`, routes.api(express.Router(), db, logger.logger));
app.use(routes.views(express.Router(), db, templates, logger.logger));

app.use((req, res, next) => {
    res.status(404).send('Page not found!');
});

app.listen(config.port, () => {
    console.log('Listening on', config.port);
});
