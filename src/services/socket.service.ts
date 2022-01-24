import { BaseController } from "../controllers/base.controller";


export class SocketService extends BaseController{
    io:any
    constructor(io:any) {
        super()
        this.io = io
        this.connect();
    }

    connect() {
        this.io.on('connection', (socket:any)=> {
            
                // console.log(data);
                 const column = this.getColumns()
                 const rows = this.getRowsData()
                //  console.log(rows)
                socket.emit('getData', {getData:true, columnData: column, rowData: rows})
            

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


            socket.on("deleteRecord", async (data:any)=>{
                // console.log(data);
                await this.deleteRecord(data.index);
                // socket.broadcast.emit('deleteRecord', {data, deleteRecord:true })
                const column = this.getColumns()
                const rows =  this.getRowsData()
                this.io.emit('getData', {getData:true, columnData: column, rowData: rows})
            })

            /** Add new Record and publish changes*/
            socket.on("addRecord", async (data:any) => {
                console.log(data);
                await this.addRecord(data?.recordToAdd, data?.index, data?.position)
                // socket.broadcast.emit('addRecord', {...data, addRecord:true})
                const column = this.getColumns()
                const rows =  this.getRowsData()
                this.io.emit('getData', {getData:true, columnData: column, rowData: rows})
            })

            socket.on("cutPasteRecord", async (data:any) => {
                console.log(data);
                await this.cutPasteRecord(data?.recordToAdd, data?.index, data?.position, data?.cutIndexes);
                const column = this.getColumns()
                const rows =  this.getRowsData()
                this.io.emit('getData', {getData:true, columnData: column, rowData: rows}) 
            })

            /** Update record and publish changes */
            socket.on("updateRecord", async (data:any) => {
                console.log(data);
                await this.editRecord(data?.recordToUpdate, data?.index);
                socket.broadcast.emit('updateRecord', {...data, updateRecord:true})
            })

            console.log('socket connected successfully');
        })
    }
}
