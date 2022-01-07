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
// Set the common part of the path for the routes in this router
const base = '/treegrid';
//Routes
//routerTemplate.post(`${base}`, (req, res) => { exampleController.createFunction(req, res) })
// routerTemplate.get(`${base}/column`, (req, res) => { exampleController.findColumns(res)})
// routerTemplate.put(`${base}/column/:id`, (req, res) => { exampleController.editColumn(req, res)})
// routerTemplate.post(`${base}/column`, (req, res) => { exampleController.addColumn(req, res)})
// routerTemplate.delete(`${base}/column/:id`, (req, res) => { exampleController.deleteColumn(req, res)})
exports.routerTemplate.get(`${base}/rows`, (req, res) => { controllers_module_1.exampleController.getRows(res); });
// routerTemplate.put(`${base}/rows/:id`, (req, res) => { exampleController.editRow(req, res)})
// routerTemplate.post(`${base}/rows/:taskId`, (req, res) => { exampleController.addRow(req, res)})
// routerTemplate.delete(`${base}/rows/:id`, (req, res) => { exampleController.deleteRow(req, res)})
