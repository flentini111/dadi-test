'use strict';

const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const omdb = require('./src/omdb');
const db = require('./src/db')(config.db, omdb);
const routes = require('./src/routes')(express.Router(), db);

const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
// TODO add winston logger
app.use(morgan('dev'));
app.use(`/api/${config.apiVersion}`, routes);

app.listen(config.port, () => {
    // TODO nicer message
    console.log('listening');
});
