import e, { Request, Response } from 'express'
import fs from 'fs';
import path from 'path';
/**
 * Provides functions to be used with express routes. Serves common CRUD fuctionality. 
 */
export class BaseController {
    columnData;
    tasks;
    lastIndexOfColumn:number;
    lastIndexOfRow:number

    constructor(
        columndata: any,
        task: any) 
    {
        this.columnData = columndata;
        this.tasks = task;
        this.lastIndexOfColumn =  Number(Object.keys(this.columnData)[Object.keys(this.columnData).length - 1]) 
        this.lastIndexOfRow = Number(Object.keys(this.tasks)[Object.keys(this.tasks).length - 1])
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
    // findColumns(res: Response, errMsg = 'Failed to find documents') {
    //     try {
    //         this.jsonRes(Object.values(this.columnData), res)
    //     }
    //     catch (error) {
    //         this.errRes(error, res, errMsg, 404)
    //     }
    // }

    getColumns() {
        return Object.values(this.columnData)
    }

    getRowsData() {
        return Object.values(this.tasks)
    }
    

    editColumn(id:number,data:any) {
        delete data.id;
        this.columnData[id] = data;
        fs.writeFile(path.join(__dirname, '../../columnGrid.json'), JSON.stringify(this.columnData),(err)=>{
            console.log(err)
        })
       return this.columnData[id]
    }

    async addColumn(data:any)  {
        console.log(data);
        
        // this.lastIndexOfColumn = this.lastIndexOfColumn +1;
        this.columnData[data.column.field] = data;
        fs.writeFile(path.join(__dirname, '../../columnGrid.json'), JSON.stringify(this.columnData), (error) => {
            if (error) {
                throw new Error("couldn't add new column");
            }
        })
        await this.addFieldInRows(data.column.field, data.column.defaultValue);
    }

    deleteColumn(data:any) {
        try {
            delete this.columnData[data.field];
            fs.writeFile(path.join(__dirname, '../../columnGrid.json'), JSON.stringify(this.columnData), (error) => {
                    if(error){
                       throw new Error("couldn't update file");
                    }
                });
           
        }
        catch(error) {
         console.log(error);
           
        }
    }
    
    getRows(res: Response, errMsg = 'Failed to find documents') {
        try {
            console.log(this.tasks)
            this.jsonRes(Object.values(this.tasks), res)
        }
        catch (error) {
            this.errRes(error, res, errMsg, 404)
        }
    }

    async addFieldInRows (field:any, value:any) {
        Object.values(this.tasks).forEach((element:any) => {
            element[field] = value;
        });
        fs.writeFile(path.join(__dirname, '../../tasks.json'), JSON.stringify(this.tasks), (error) => {
            if(error){
               throw new Error("Error in adding new field");
            }
        });
    }
    
    deleteRow(id: Array<any>) {
        id.forEach(element => delete this.tasks[element]);
        fs.writeFile(path.join(__dirname, '../../tasks.json'), JSON.stringify(this.tasks), (error) => {
                if(error){
                   throw new Error("couldn't update file");
                }
            });
        return this.tasks
    }

    editRow(id:number,data:any){
        delete data.id
        this.tasks[id] = data;
            fs.writeFile(path.join(__dirname, '../../tasks.json'), JSON.stringify(this.tasks), (error) => {
                if (error) {
                    throw new Error("couldn't update file");
                }
                else {
                    console.log("data created successfully")
                }
            });
          return this.tasks[id]
    }

   
    addRow(req:Request, res:Response,  errMsg = `Failed to add document `) {
         try {
            this.lastIndexOfRow = this.lastIndexOfRow +1;
            let stringLastIndexOfRow:number = JSON.parse(JSON.stringify(this.lastIndexOfRow));
            if(req.body.isParent === true){
                let parentId:any = req.params.taskId
            }
            // else {
            //     parentId = -1
            // }
            let keyValues = Object.entries(this.tasks); 
            keyValues.splice(req.body.index, 0, [stringLastIndexOfRow.toString(), {...req.body, parentId:req.params.taskID}]); 
            this.tasks = Object.fromEntries(keyValues) 

            fs.writeFile(path.join(__dirname, '../../columnGrid.json'), JSON.stringify( this.tasks), (error) => {
                if (error) {
                    throw new Error("couldn't add new column");
                }
            })
            this.jsonRes(this.tasks, res)
        }
        catch (error) {
             this.errRes(error, res, errMsg, 404)
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
