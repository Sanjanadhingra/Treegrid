
import {columnData} from "../columnGrid.json"
import {tasks} from "../tasks.json"
import {Request, Response } from 'express'


/**
 * Provides functions to be used with express routes. Serves common CRUD fuctionality. 
 */
export class BaseController {
    columnjson:any;
    taskJson:any;

    constructor() {
        columnData:Array<any>,
        tasks:Array<any>
    }
    
    jsonRes(doc: any, res: Response) {
        res.status(200).json(doc);
    }
    
    errRes(err: any, res: Response, message = 'Sever Error', status = 500) {
        res.status(status).json({ error: message });
    }
   
    /**
     * Returns all documents of model
     */
    findColumns(res: Response, errMsg = 'Failed to find documents') {
       try {
           console.log(columnData)
         this.jsonRes(columnData, res)}
       catch(error) {
        this.errRes(error,res,errMsg, 404)
       }
    }

    editColumn(req:Request,res: Response, errMsg = `Failed to find document `){
        let objIndex:number;
        console.log(req.params.name);
        objIndex = columnData.findIndex((obj => obj.name == req.params.name));
        console.log(objIndex);
        //columnData[objIndex] = req
    }

    /**
     * Returns single doucument of model specified by _id. 
     */
    findById(res: Response, documentId: string, errMsg = `Failed to find document ${documentId}`) {
    
    }
    /**
     * Returns single document from given model that matches the query.
     */
    findOne(res: Response, query: any,  errMsg = `Failed to find document ${query}`) {
    }

    findMany(res: Response, query: any,  errMsg = `Failed to find document ${query}`) {
       
    }

    /**
     * Updates single document, 
     */
    updateById(res: Response, documentId: string, document: any, errMsg = `Failed to update document ${documentId}`) {
      
    }
    /**
     * Deletes a single document selected by id 
     */
    deleteById(res: Response, documentId: string, errMsg = `Failed to delete document ${documentId}`) {
    
    }
}
