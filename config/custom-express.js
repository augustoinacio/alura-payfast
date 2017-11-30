var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var logger = require('../servicos/logger');
var morgan = require('morgan');

module.exports = function () {
    var app = express();

    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(morgan("common", {
        stream: {
            write: function (mensagem) {
                logger.info(mensagem);
            }
        }
    }))
    app.use(bodyParser.json());
    app.use(expressValidator());

    consign()
        .include('controllers')
        .then('persistencia')
        .then('servicos')
        .into(app);

    return app;
}