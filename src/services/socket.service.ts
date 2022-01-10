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
                socket.emit('getColumn', {getColumn:true, columnData: column, rowData: rows})
            })

            socket.on("editColumn", (data:any)=>{
                const updatedColumn = this.editColumn(data.id, data)
                this.io.emit("editColumn", {editColumn:true, ...updatedColumn})
            })
            
            socket.on("addColumn", (data:any) => {
                this.addColumn(data);
                const column = this.getColumns()
                const rows =  this.getRowsData()
                socket.emit('getColumn', {getColumn:true, columnData: column, rowData: rows})
            })

            socket.on("deleteColumn", (data:any) => {
                this.deleteColumn(data)
                const column = this.getColumns()
                const rows =  this.getRowsData()
                socket.emit('getColumn', {getColumn:true, columnData: column, rowData: rows})
            })


            socket.on("deleteRow", (data:any)=>{
                const deletedRow = this.deleteRow(data)
                socket.broadcast.emit("deleteRow", {deleteRow:true, ...deletedRow})
            })

            socket.on("editRow", (data:any) => {
               const editedRow = this.editRow(data.id, data)
               socket.broadcast.emit("editRow", {editRow:true, ...editedRow})
            })

            socket.on("addRow", (data:any) => {

            })
            console.log('socket connected successfully');
        })
    }
    

}
