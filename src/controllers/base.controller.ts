import { Request, Response } from 'express'
import  fs  from 'fs';
/**
 * Provides functions to be used with express routes. Serves common CRUD fuctionality. 
 */
export class BaseController {
    columnData;
    tasks;

    constructor(
        columndata: Array<any>,
        task: any,
    ) {
        this.columnData = columndata;
        this.tasks = task
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
            this.jsonRes(this.columnData, res)
        }
        catch (error) {
            this.errRes(error, res, errMsg, 404)
        }
    }

    editColumn(req: Request, res: Response, errMsg = `Failed to find document `) {
        try {
            let objIndex: number;
            objIndex = this.columnData.findIndex((obj => obj.name == req.params.name));
            if (objIndex === -1) {
                throw ("Couldn't find")
            }
            this.columnData[objIndex] = req.body;
            console.log("coll",this.columnData);
            var obj:any = {};
            obj["columnData"] = this.columnData;
            console.log(obj);
                fs.writeFile('../columnGrid.json', obj, (error) => {
                    if(error){
                        console.log(error);
                    }
                    else{
                    console.log("data craeted successfully")
                    }
                });
            // for(let i:number=0; i<=this.tasks.length; i++){
            //     delete Object.assign(this.tasks[i], {[req.body.name]: this.tasks[i][req.params.name] }) [this.tasks[i][req.params.name]];
            //    /// this.tasks[i][req.params.name] = this.tasks[i][]
            // }
            this.jsonRes(this.columnData, res)
        }
        catch (error) {

        }

    }

    /**
     * Returns single doucument of model specified by _id. 
     */
    findById(res: Response, documentId: string, errMsg = `Failed to find document ${documentId}`) {

    }
    /**
     * Returns single document from given model that matches the query.
     */
    findOne(res: Response, query: any, errMsg = `Failed to find document ${query}`) {
    }

    findMany(res: Response, query: any, errMsg = `Failed to find document ${query}`) {

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
