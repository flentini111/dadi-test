'use strict';

const fs = require('fs');
const dust = require('dustjs-linkedin');
const templates = {};

fs.readdirSync('./views').filter((file) => {
    return /\.js$/.test(file);
}).forEach((template) => {
    templates[template.slice(0, -3)] = require(`../views/${template}`)(dust);
});

module.exports = templates;
