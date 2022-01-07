import { Response, Request } from "express";
import { BaseController } from "./base.controller";
let columnData = require("../../columnGrid.json")
let tasks = require("../../tasks.json")

export class ExampleController extends BaseController{
    data: any = {};

    constructor() {
        super(columnData,tasks);
    }

    createFunction(req:Request,res:Response){
    var fs = require('fs');
    fs.writeFile ("../treegrid.json", JSON.stringify(this.data), function(err:any) {
     if (err) {
       console.log(err)
       console.log('complete');
    }});  
    res.status(200).json("hello");
}
    

}
