//express imports
import express from 'express';
export const routerTemplate = express.Router();

//controllers
import { exampleController } from "../controllers/controllers.module";
console.log(exampleController.data);

// Set the common part of the path for the routes in this router
const base = '/treegrid'

//Routes
routerTemplate.post(`${base}`, (req, res) => { exampleController.createFunction(req, res) })
routerTemplate.delete(`${base}/:id`, (req, res) => { exampleController.deleteById(res, req.params.id)})
routerTemplate.get(`${base}/:id`, (req, res) => { exampleController.findById(res, req.params.id)})
routerTemplate.get(`${base}`, (req, res) => { exampleController.findColumns(res)})
routerTemplate.put(`${base}/:name`, (req, res) => { exampleController.editColumn(req, res)})