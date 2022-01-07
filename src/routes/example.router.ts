//express imports
import express from 'express';
export const routerTemplate = express.Router();

//controllers
import { exampleController } from "../controllers/controllers.module";

// Set the common part of the path for the routes in this router
const base = '/treegrid'

//Routes
//routerTemplate.post(`${base}`, (req, res) => { exampleController.createFunction(req, res) })
// routerTemplate.get(`${base}/column`, (req, res) => { exampleController.findColumns(res)})
// routerTemplate.put(`${base}/column/:id`, (req, res) => { exampleController.editColumn(req, res)})
// routerTemplate.post(`${base}/column`, (req, res) => { exampleController.addColumn(req, res)})
// routerTemplate.delete(`${base}/column/:id`, (req, res) => { exampleController.deleteColumn(req, res)})

 routerTemplate.get(`${base}/rows`, (req, res) => { exampleController.getRows(res)})
// routerTemplate.put(`${base}/rows/:id`, (req, res) => { exampleController.editRow(req, res)})
// routerTemplate.post(`${base}/rows/:taskId`, (req, res) => { exampleController.addRow(req, res)})
// routerTemplate.delete(`${base}/rows/:id`, (req, res) => { exampleController.deleteRow(req, res)})