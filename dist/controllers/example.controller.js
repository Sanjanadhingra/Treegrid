"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExampleController = void 0;
const base_controller_1 = require("./base.controller");
let columnData = require("../../columnGrid.json");
let tasks = require("../../tasks.json");
class ExampleController extends base_controller_1.BaseController {
    constructor() {
        super(columnData, tasks);
        this.data = {};
    }
    createFunction(req, res) {
        var fs = require('fs');
        fs.writeFile("../treegrid.json", JSON.stringify(this.data), function (err) {
            if (err) {
                console.log(err);
                console.log('complete');
            }
        });
        res.status(200).json("hello");
    }
}
exports.ExampleController = ExampleController;
