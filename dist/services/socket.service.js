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
                socket.emit('getColumn', { getColumn: true, columnData: column, rowData: rows });
            });
            socket.on("editColumn", (data) => {
                const updatedColumn = this.editColumn(data.id, data);
                this.io.emit("editColumn", Object.assign({ editColumn: true }, updatedColumn));
            });
            socket.on("addColumn", (data) => {
                this.addColumn(data);
                const column = this.getColumns();
                const rows = this.getRowsData();
                socket.emit('getColumn', { getColumn: true, columnData: column, rowData: rows });
            });
            socket.on("deleteColumn", (data) => {
                this.deleteColumn(data);
                const column = this.getColumns();
                const rows = this.getRowsData();
                socket.emit('getColumn', { getColumn: true, columnData: column, rowData: rows });
            });
            socket.on("deleteRow", (data) => {
                const deletedRow = this.deleteRow(data);
                socket.broadcast.emit("deleteRow", Object.assign({ deleteRow: true }, deletedRow));
            });
            socket.on("editRow", (data) => {
                const editedRow = this.editRow(data.id, data);
                socket.broadcast.emit("editRow", Object.assign({ editRow: true }, editedRow));
            });
            socket.on("addRow", (data) => {
            });
            console.log('socket connected successfully');
        });
    }
}
exports.SocketService = SocketService;
