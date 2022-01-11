"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const base_controller_1 = require("../controllers/base.controller");
let columnData = require("../../columnGrid.json");
let tasks = require('../../tasks.json');
class SocketService extends base_controller_1.BaseController {
    constructor(io) {
        super(columnData, tasks);
        this.io = io;
        this.connect();
    }
    connect() {
        this.io.on('connection', (socket) => {
            socket.on('data', (data) => {
                console.log(data);
                const column = this.getColumns();
                const rows = this.getRowsData();
                console.log(rows);
                socket.emit('getData', { getData: true, columnData: column, rowData: rows });
            });
            socket.on("editColumn", (data) => {
                const updatedColumn = this.editColumn(data);
                const column = this.getColumns();
                const rows = this.getRowsData();
                this.io.emit('getData', { getData: true, columnData: column, rowData: rows });
            });
            socket.on("addColumn", (data) => {
                this.addColumn(data);
                const column = this.getColumns();
                const rows = this.getRowsData();
                this.io.emit('getData', { getData: true, columnData: column, rowData: rows });
            });
            socket.on("deleteColumn", (data) => {
                this.deleteColumn(data);
                const column = this.getColumns();
                const rows = this.getRowsData();
                this.io.emit('getData', { getData: true, columnData: column, rowData: rows });
            });
            socket.on("deleteRow", (data) => {
                const deletedRow = this.deleteRow(data);
                this.io.emit("deleteRow", Object.assign({ deleteRow: true }, deletedRow));
            });
            socket.on("editRow", (data) => {
                const editedRow = this.editRow(data.id, data);
                this.io.emit("editRow", Object.assign({ editRow: true }, editedRow));
            });
            socket.on("addRow", (data) => {
            });
            console.log('socket connected successfully');
        });
    }
}
exports.SocketService = SocketService;
