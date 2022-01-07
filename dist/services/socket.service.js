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
                //  const column = this.getColumns()
                //  console.log(column)
                socket.emit('getColumn', { name: 'socket' });
            });
            socket.on("editColumn", (data) => {
                const updatedColumn = this.editColumn(data.id, data);
            });
            console.log('socket connected successfully');
        });
    }
}
exports.SocketService = SocketService;
