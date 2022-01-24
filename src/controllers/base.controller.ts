import e, { Request, Response } from 'express'
import fs from 'fs';
import path from 'path';
let columnData = require("../../columnGrid.json")
let tasks = require( '../../tasks.json')
/**
 * Provides functions to be used with express routes. Serves common CRUD fuctionality. 
 */
export class BaseController {
    columnData;
    tasks;
    record:any;
    lastIndexOfColumn:number;
    lastIndexOfRow:number

    constructor() 
    {
        this.columnData = columnData;
        this.tasks = tasks;
        this.lastIndexOfColumn =  Number(Object.keys(this.columnData)[Object.keys(this.columnData).length - 1]) 
        this.lastIndexOfRow = Number(this.tasks[this.tasks.length - 1])
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
        return this.tasks
    }
    

    async editColumn(data:any) {
        if(this.columnData[data.column.field].column.type === data.column.type){
          
        }
        this.columnData[data.column.field] = data;
        fs.writeFile(path.join(__dirname, '../../columnGrid.json'), JSON.stringify(this.columnData),(err)=>{
            console.log(err)
        })
        await this.editFieldInRows(data.column.field, data.column.type, data.column.defaultValue, this.tasks);
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
        await this.addFieldInRows(data.column.field, data.column.defaultValue, this.tasks);
        this.writeTasksToFile();
    }

    async deleteColumn(data:any) {
        delete this.columnData[data.field];
            fs.writeFile(path.join(__dirname, '../../columnGrid.json'), JSON.stringify(this.columnData), (error) => {
                    if(error){
                       throw new Error("couldn't update file");
                    }
            });
        await this.deleteFieldInRows(data.field, this.tasks);
        this.writeTasksToFile();
    }
    
    getRows(res: Response, errMsg = 'Failed to find documents') {
        try {
            console.log(this.tasks)
            this.jsonRes(this.tasks, res)
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
        await this.deleteRow(index, this.tasks);
        await this.writeTasksToFile();
    }

    async deleteRow(index:number, tasks:any, currCount:number = 0){
        for(let i=0; i<tasks.length; i++) {
            if(currCount>index) break;
            if(currCount == index) {
                tasks.splice(i,1);    
            }
            currCount += 1;
            if(tasks[i]?.subTasks && tasks[i]?.subTasks.length) {
                currCount = await this.deleteRow(index, tasks[i]?.subTasks, currCount)
            }
        }
        return currCount  
    }

    /** Function to update record */
    async editRecord(record:any, index:number){
        delete record.index;
        record['createdAt'] = new Date();
        await this.editRow(record, index, this.tasks);
        await this.writeTasksToFile();
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
        this.record = record;
        delete record[0].index;
        await this.addTimeStamp(this.record)
        await this.addRow(this.record, index, position, this.tasks)
        await this.writeTasksToFile();
    }

   /** Recursive function to find the index position and insert new record to that position */
    async addRow(record:any, index:number, position:string, tasks:any, currCount:number = 0) {
        
        for(let i=0; i<tasks.length; i++) {
            if(currCount>index) break;
            if(currCount == index) {
                if(position == 'Child') {
                    if(tasks[i]['subTasks']){
                        tasks[i].subTasks.push(...record)
                        
                    } else {
                        tasks[i]['subTasks'] = [...record];
                    }
                } else {
                    tasks.splice(i+1, 0, ...record);
                    
                }  
            }
            currCount += 1;
            if(tasks[i]?.subTasks && tasks[i]?.subTasks.length) {
                currCount = await this.addRow(record, index, position, tasks[i]?.subTasks, currCount)
            }
        }
        return currCount    
    }

    async cutPasteRecord(record:any, index:number, position:string, cutIndexes:any) {
        await this.cutPasteRow(record, index, position, this.tasks, cutIndexes);
        // await this.removeNull(this.tasks)
        await this.writeTasksToFile();
    }

    async cutPasteRow(record:any, index:number, position:string, tasks:any, cutIndexes:any, currCount:number = 0) {
        for(let i=0; i<tasks.length; i++) {
            if(cutIndexes?.includes(currCount)) { tasks[i]['isDeleted'] = true }
            if(currCount == index) {
                if(position == 'Child') {
                    if(tasks[i]['subTasks']){
                        console.log('pushed to child');
                        tasks[i].subTasks.push(...record)
                    } else {
                        console.log('pushed to child');
                        tasks[i]['subTasks'] = [...record];   
                    }
                } else {
                    console.log('pushed next');   
                    tasks.splice(i+1, 0, ...record);
                }  
            }
            currCount += 1;
            if(tasks[i]?.subTasks && tasks[i]?.subTasks.length) {
                currCount = await this.cutPasteRow(record, index, position, tasks[i]?.subTasks, cutIndexes, currCount)
            }
        }
        return currCount
    }

    async removeNull(tasks:any) {
        for(let i=0; i<tasks.length; i++) {
            if(tasks[i]['isDeleted']&& tasks[i]['isDeleted'] == true) {
                console.log('item deleted');
                
                tasks.splice(i,1);
            }
            if(tasks[i]?.subTasks && tasks[i]?.subTasks.length) {
                await this.removeNull(tasks[i]?.subTasks)
            }
        }   
    }

    async addTimeStamp(tasks:any) {
        let len = tasks.length;
        for(let i=0; i<len; i++) {
            tasks[i]['createdAt'] = new Date();
            if(tasks[i]?.subTasks && tasks[i]?.subTasks.length) {
                await this.addTimeStamp(tasks[i]?.subTasks);
            }
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

    async writeTasksToFile(){
        fs.writeFile(path.join(__dirname, '../../tasks.json'), JSON.stringify(this.tasks), (error) => {
            if(error){
               throw new Error("Error in adding new field");
            }
        });
    }
}
