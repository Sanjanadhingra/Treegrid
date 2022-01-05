"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerTemplate = void 0;
//express imports
const express_1 = __importDefault(require("express"));
exports.routerTemplate = express_1.default.Router();
//controllers
const controllers_module_1 = require("../controllers/controllers.module");
console.log(controllers_module_1.exampleController.data);
// Set the common part of the path for the routes in this router
const base = '/treegrid';
//Routes
exports.routerTemplate.post(`${base}`, (req, res) => { controllers_module_1.exampleController.createFunction(req, res); });
exports.routerTemplate.delete(`${base}/:id`, (req, res) => { controllers_module_1.exampleController.deleteById(res, req.params.id); });
exports.routerTemplate.get(`${base}/:id`, (req, res) => { controllers_module_1.exampleController.findById(res, req.params.id); });
exports.routerTemplate.get(`${base}`, (req, res) => { controllers_module_1.exampleController.findColumns(res); });
exports.routerTemplate.put(`${base}/:name`, (req, res) => { controllers_module_1.exampleController.editColumn(req, res); });
