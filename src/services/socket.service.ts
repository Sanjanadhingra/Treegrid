import { BaseController } from "../controllers/base.controller";
let columnData = require("../../columnGrid.json")
let tasks = require( '../../tasks.json')

export class SocketService extends BaseController{
    io:any
    constructor(io:any) {
        super(columnData,tasks)
        this.io = io
        this.connect();
    }

    connect() {
        this.io.on('connection', (socket:any)=> {
            socket.on('data', (data:any) => {
                console.log(data);
                 const column = this.getColumns()
                 const rows = this.getRowsData()
                 console.log(rows)
                socket.emit('getData', {getData:true, columnData: column, rowData: rows})
            })

            socket.on("editColumn", (data:any)=>{
                const updatedColumn = this.editColumn(data)
                const column = this.getColumns()
                const rows =  this.getRowsData()
                this.io.emit('getData', {getData:true, columnData: column, rowData: rows})
            })
            
            socket.on("addColumn", (data:any) => {
                this.addColumn(data);
                const column = this.getColumns()
                const rows =  this.getRowsData()
                this.io.emit('getData', {getData:true, columnData: column, rowData: rows})
            })

            socket.on("deleteColumn", (data:any) => {
                this.deleteColumn(data)
                const column = this.getColumns()
                const rows =  this.getRowsData()
                this.io.emit('getData', {getData:true, columnData: column, rowData: rows})
            })


            socket.on("deleteRecord", (data:any)=>{
                console.log(data);
                
                socket.broadcast.emit("deleteRecord", {deleteRecord:true, data})
            })

            /** Add new Record and publish changes*/
            socket.on("addRecord", (data:any) => {
                console.log(data);
                this.addRecord(data?.recordToAdd, data?.index, data?.position)
                socket.broadcast.emit('addRecord', {...data, addRecord:true})
            })

            /** Update record and publish changes */
            socket.on("updateRecord", (data:any) => {
                console.log(data);
                this.editRecord(data?.recordToUpdate, data?.index);
                socket.broadcast.emit('updateRecord', {...data, updateRecord:true})
            })
            console.log('socket connected successfully');
        })
    }
    

}
