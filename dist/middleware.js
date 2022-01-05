"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const bodyParser = require("body-parser");
const cors = require("cors");
exports.middleware = [
    bodyParser.json(),
    bodyParser.urlencoded({ extended: true }),
    cors(),
    function (req, res, next) {
        res.set('Cache-Control', 'no-store, max-age=0');
        next();
    },
    function (req, res, next) {
        res.header("Access-Control-Allow-Origin");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    },
];
