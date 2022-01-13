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

    getColumns() {
        return Object.values(this.columnData)
    }

    getRowsData() {
        return Object.values(this.tasks)
    }
    

    async editColumn(data:any) {
        if(this.columnData[data.column.field].column.type === data.column.type){
          
        }
        this.columnData[data.column.field] = data;
        fs.writeFile(path.join(__dirname, '../../columnGrid.json'), JSON.stringify(this.columnData),(err)=>{
            console.log(err)
        })
        await this.editFieldInRows(data.column.field, data.column.type, data.column.defaultValue, Object.values(this.tasks));
        this.writeTasksToFile();
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
        await this.addFieldInRows(data.column.field, data.column.defaultValue, Object.values(this.tasks));
        this.writeTasksToFile();
    }

    async deleteColumn(data:any) {
        delete this.columnData[data.field];
            fs.writeFile(path.join(__dirname, '../../columnGrid.json'), JSON.stringify(this.columnData), (error) => {
                    if(error){
                       throw new Error("couldn't update file");
                    }
            });
        await this.deleteFieldInRows(data.field, Object.values(this.tasks));
        this.writeTasksToFile();
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

    async addFieldInRows (field:any, value:any, tasks:any) {
        if(Array.isArray(tasks)) {
            tasks.forEach((element:any) => {
                element[field] = value;
                if(element?.subTasks && element?.subTasks.length) {
                    this.addFieldInRows(field, value, element?.subTasks)
                }
            })
        }
    }
    
    async deleteFieldInRows (field:any, tasks:any){
        tasks.forEach((element:any) => {
             delete element[field];
             if(element?.subTasks && element?.subTasks.length) {
                this.deleteFieldInRows(field, element?.subTasks)
            }
        });
    }

    async editFieldInRows (field:any,type:any,value:any, tasks:any) {
        tasks.forEach((element:any) => {
            if(type === "string"){
                element[field] === String(element[field]);
            }
            if(type === "date"){
                element[field] === new Date(element[field]);
            }

            if(type === "number"){
               Number(element[field])? element[field] === value: element[field] === Number(element[field])
            }
            if(type === "boolean"){
               element[field] === Boolean(element[field]);
            }
            if(element?.subTasks && element?.subTasks.length) {
                this.editFieldInRows(field, type, value, element?.subTasks)
            }
        });
    }

    async deleteRecord(index:number) {
        // this.deleteRow(index, Object.values(this.tasks));
        this.writeTasksToFile();
    }

    async deleteRow(id: Array<any>) {
        id.forEach(element => delete this.tasks[element]);
        this.writeTasksToFile();
        return this.tasks
    }

    /** Function to update record */
    async editRecord(record:any, index:number){
        await this.editRow(record, index, Object.values(this.tasks));
        this.writeTasksToFile();
    }

    /** Recursive function to find and update record */
    async editRow(record:any, index:number, tasks:any, currCount:number = 0){
        for(let i=0; i<tasks.length; i++) {
            if(currCount>index) break;
            if(currCount == index) {
                tasks[i] = {...tasks[i], ...record};    
            }
            currCount += 1;
            if(tasks[i]?.subTasks && tasks[i]?.subTasks.length) {
                currCount = await this.editRow(record, index, tasks[i]?.subTasks, currCount)
            }
        }
        return currCount  
    }

    /** Function to add new Record */
    async addRecord(record:any, index:number, position:string) {
        await this.addRow(record, index, position, Object.values(this.tasks))
        this.writeTasksToFile();
    }

   /** Recursive function to find the index position and insert new record to that position */
    async addRow(record:any, index:number, position:string, tasks:any, currCount:number = 0) {
        for(let i=0; i<tasks.length; i++) {
            if(currCount>index) break;
            if(currCount == index) {
                if(position == 'Child') {
                    if(tasks[i]['subTasks']){
                        tasks[i].subTasks.push(record)
                        
                    } else {
                        tasks[i]['subTasks'] = [record];
                    }
                } else {
                    tasks.splice(i+1, 0, record);
                    
                }  
            }
            currCount += 1;
            if(tasks[i]?.subTasks && tasks[i]?.subTasks.length) {
                currCount = await this.addRow(record, index, position, tasks[i]?.subTasks, currCount)
            }
        }
        return currCount    
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

    writeTasksToFile(){
        fs.writeFile(path.join(__dirname, '../../tasks.json'), JSON.stringify(this.tasks), (error) => {
            if(error){
               throw new Error("Error in adding new field");
            }
        });
    }
}
