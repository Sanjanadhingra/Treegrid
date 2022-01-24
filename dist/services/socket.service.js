"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const base_controller_1 = require("../controllers/base.controller");
class SocketService extends base_controller_1.BaseController {
    constructor(io) {
        super();
        this.io = io;
        this.connect();
    }
    connect() {
        this.io.on('connection', (socket) => {
            // console.log(data);
            const column = this.getColumns();
            const rows = this.getRowsData();
            //  console.log(rows)
            socket.emit('getData', { getData: true, columnData: column, rowData: rows });
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
            socket.on("deleteRecord", (data) => __awaiter(this, void 0, void 0, function* () {
                // console.log(data);
                yield this.deleteRecord(data.index);
                // socket.broadcast.emit('deleteRecord', {data, deleteRecord:true })
                const column = this.getColumns();
                const rows = this.getRowsData();
                this.io.emit('getData', { getData: true, columnData: column, rowData: rows });
            }));
            /** Add new Record and publish changes*/
            socket.on("addRecord", (data) => __awaiter(this, void 0, void 0, function* () {
                console.log(data);
                yield this.addRecord(data === null || data === void 0 ? void 0 : data.recordToAdd, data === null || data === void 0 ? void 0 : data.index, data === null || data === void 0 ? void 0 : data.position);
                // socket.broadcast.emit('addRecord', {...data, addRecord:true})
                const column = this.getColumns();
                const rows = this.getRowsData();
                this.io.emit('getData', { getData: true, columnData: column, rowData: rows });
            }));
            socket.on("cutPasteRecord", (data) => __awaiter(this, void 0, void 0, function* () {
                console.log(data);
                yield this.cutPasteRecord(data === null || data === void 0 ? void 0 : data.recordToAdd, data === null || data === void 0 ? void 0 : data.index, data === null || data === void 0 ? void 0 : data.position, data === null || data === void 0 ? void 0 : data.cutIndexes);
                const column = this.getColumns();
                const rows = this.getRowsData();
                this.io.emit('getData', { getData: true, columnData: column, rowData: rows });
            }));
            /** Update record and publish changes */
            socket.on("updateRecord", (data) => __awaiter(this, void 0, void 0, function* () {
                console.log(data);
                yield this.editRecord(data === null || data === void 0 ? void 0 : data.recordToUpdate, data === null || data === void 0 ? void 0 : data.index);
                socket.broadcast.emit('updateRecord', Object.assign(Object.assign({}, data), { updateRecord: true }));
            }));
            console.log('socket connected successfully');
        });
    }
}
exports.SocketService = SocketService;
