'use strict';

const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const omdb = require('./src/omdb');
const db = require('./src/db')(config.db, omdb);
const logger = require('./src/logger')(config.log);
const routes = require('./src/routes');
const templates = require('./src/templates');

const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(morgan('combined', {stream: logger.stream}));

// register routes
app.use(`/api/${config.apiVersion}`, routes.api(express.Router(), db, logger.logger));

app.use(routes.views(express.Router(), db, templates));

app.listen(config.port, () => {
    console.log('Listening on', config.port);
});
