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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
let columnData = require("../../columnGrid.json");
let tasks = require('../../tasks.json');
/**
 * Provides functions to be used with express routes. Serves common CRUD fuctionality.
 */
class BaseController {
    constructor() {
        this.columnData = columnData;
        this.tasks = tasks;
        this.lastIndexOfColumn = Number(Object.keys(this.columnData)[Object.keys(this.columnData).length - 1]);
        this.lastIndexOfRow = Number(this.tasks[this.tasks.length - 1]);
    }
    jsonRes(doc, res) {
        res.status(200).json(doc);
    }
    errRes(err, res, message = 'Sever Error', status = 500) {
        res.status(status).json({ error: message });
    }
    getColumns() {
        return Object.values(this.columnData);
    }
    getRowsData() {
        return this.tasks;
    }
    editColumn(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.columnData[data.column.field].column.type === data.column.type) {
            }
            this.columnData[data.column.field] = data;
            fs_1.default.writeFile(path_1.default.join(__dirname, '../../columnGrid.json'), JSON.stringify(this.columnData), (err) => {
                console.log(err);
            });
            yield this.editFieldInRows(data.column.field, data.column.type, data.column.defaultValue, this.tasks);
            this.writeTasksToFile();
        });
    }
    addColumn(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(data);
            // this.lastIndexOfColumn = this.lastIndexOfColumn +1;
            this.columnData[data.column.field] = data;
            fs_1.default.writeFile(path_1.default.join(__dirname, '../../columnGrid.json'), JSON.stringify(this.columnData), (error) => {
                if (error) {
                    throw new Error("couldn't add new column");
                }
            });
            yield this.addFieldInRows(data.column.field, data.column.defaultValue, this.tasks);
            this.writeTasksToFile();
        });
    }
    deleteColumn(data) {
        return __awaiter(this, void 0, void 0, function* () {
            delete this.columnData[data.field];
            fs_1.default.writeFile(path_1.default.join(__dirname, '../../columnGrid.json'), JSON.stringify(this.columnData), (error) => {
                if (error) {
                    throw new Error("couldn't update file");
                }
            });
            yield this.deleteFieldInRows(data.field, this.tasks);
            this.writeTasksToFile();
        });
    }
    getRows(res, errMsg = 'Failed to find documents') {
        try {
            console.log(this.tasks);
            this.jsonRes(this.tasks, res);
        }
        catch (error) {
            this.errRes(error, res, errMsg, 404);
        }
    }
    addFieldInRows(field, value, tasks) {
        return __awaiter(this, void 0, void 0, function* () {
            if (Array.isArray(tasks)) {
                tasks.forEach((element) => {
                    element[field] = value;
                    if ((element === null || element === void 0 ? void 0 : element.subTasks) && (element === null || element === void 0 ? void 0 : element.subTasks.length)) {
                        this.addFieldInRows(field, value, element === null || element === void 0 ? void 0 : element.subTasks);
                    }
                });
            }
        });
    }
    deleteFieldInRows(field, tasks) {
        return __awaiter(this, void 0, void 0, function* () {
            tasks.forEach((element) => {
                delete element[field];
                if ((element === null || element === void 0 ? void 0 : element.subTasks) && (element === null || element === void 0 ? void 0 : element.subTasks.length)) {
                    this.deleteFieldInRows(field, element === null || element === void 0 ? void 0 : element.subTasks);
                }
            });
        });
    }
    editFieldInRows(field, type, value, tasks) {
        return __awaiter(this, void 0, void 0, function* () {
            tasks.forEach((element) => {
                if (type === "string") {
                    element[field] === String(element[field]);
                }
                if (type === "date") {
                    element[field] === new Date(element[field]);
                }
                if (type === "number") {
                    Number(element[field]) ? element[field] === value : element[field] === Number(element[field]);
                }
                if (type === "boolean") {
                    element[field] === Boolean(element[field]);
                }
                if ((element === null || element === void 0 ? void 0 : element.subTasks) && (element === null || element === void 0 ? void 0 : element.subTasks.length)) {
                    this.editFieldInRows(field, type, value, element === null || element === void 0 ? void 0 : element.subTasks);
                }
            });
        });
    }
    deleteRecord(index) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.deleteRow(index, this.tasks);
            yield this.writeTasksToFile();
        });
    }
    deleteRow(index, tasks, currCount = 0) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < tasks.length; i++) {
                if (currCount > index)
                    break;
                if (currCount == index) {
                    tasks.splice(i, 1);
                }
                currCount += 1;
                if (((_a = tasks[i]) === null || _a === void 0 ? void 0 : _a.subTasks) && ((_b = tasks[i]) === null || _b === void 0 ? void 0 : _b.subTasks.length)) {
                    currCount = yield this.deleteRow(index, (_c = tasks[i]) === null || _c === void 0 ? void 0 : _c.subTasks, currCount);
                }
            }
            return currCount;
        });
    }
    /** Function to update record */
    editRecord(record, index) {
        return __awaiter(this, void 0, void 0, function* () {
            delete record.index;
            record['createdAt'] = new Date();
            yield this.editRow(record, index, this.tasks);
            yield this.writeTasksToFile();
        });
    }
    /** Recursive function to find and update record */
    editRow(record, index, tasks, currCount = 0) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < tasks.length; i++) {
                if (currCount > index)
                    break;
                if (currCount == index) {
                    tasks[i] = Object.assign(Object.assign({}, tasks[i]), record);
                }
                currCount += 1;
                if (((_a = tasks[i]) === null || _a === void 0 ? void 0 : _a.subTasks) && ((_b = tasks[i]) === null || _b === void 0 ? void 0 : _b.subTasks.length)) {
                    currCount = yield this.editRow(record, index, (_c = tasks[i]) === null || _c === void 0 ? void 0 : _c.subTasks, currCount);
                }
            }
            return currCount;
        });
    }
    /** Function to add new Record */
    addRecord(record, index, position) {
        return __awaiter(this, void 0, void 0, function* () {
            this.record = record;
            delete record[0].index;
            yield this.addTimeStamp(this.record);
            yield this.addRow(this.record, index, position, this.tasks);
            yield this.writeTasksToFile();
        });
    }
    /** Recursive function to find the index position and insert new record to that position */
    addRow(record, index, position, tasks, currCount = 0) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < tasks.length; i++) {
                if (currCount > index)
                    break;
                if (currCount == index) {
                    if (position == 'Child') {
                        if (tasks[i]['subTasks']) {
                            tasks[i].subTasks.push(...record);
                        }
                        else {
                            tasks[i]['subTasks'] = [...record];
                        }
                    }
                    else {
                        tasks.splice(i + 1, 0, ...record);
                    }
                }
                currCount += 1;
                if (((_a = tasks[i]) === null || _a === void 0 ? void 0 : _a.subTasks) && ((_b = tasks[i]) === null || _b === void 0 ? void 0 : _b.subTasks.length)) {
                    currCount = yield this.addRow(record, index, position, (_c = tasks[i]) === null || _c === void 0 ? void 0 : _c.subTasks, currCount);
                }
            }
            return currCount;
        });
    }
    cutPasteRecord(record, index, position, cutIndexes) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.cutPasteRow(record, index, position, this.tasks, cutIndexes);
            // await this.removeNull(this.tasks)
            yield this.writeTasksToFile();
        });
    }
    cutPasteRow(record, index, position, tasks, cutIndexes, currCount = 0) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < tasks.length; i++) {
                if (cutIndexes === null || cutIndexes === void 0 ? void 0 : cutIndexes.includes(currCount)) {
                    tasks[i]['isDeleted'] = true;
                }
                if (currCount == index) {
                    if (position == 'Child') {
                        if (tasks[i]['subTasks']) {
                            console.log('pushed to child');
                            tasks[i].subTasks.push(...record);
                        }
                        else {
                            console.log('pushed to child');
                            tasks[i]['subTasks'] = [...record];
                        }
                    }
                    else {
                        console.log('pushed next');
                        tasks.splice(i + 1, 0, ...record);
                    }
                }
                currCount += 1;
                if (((_a = tasks[i]) === null || _a === void 0 ? void 0 : _a.subTasks) && ((_b = tasks[i]) === null || _b === void 0 ? void 0 : _b.subTasks.length)) {
                    currCount = yield this.cutPasteRow(record, index, position, (_c = tasks[i]) === null || _c === void 0 ? void 0 : _c.subTasks, cutIndexes, currCount);
                }
            }
            return currCount;
        });
    }
    removeNull(tasks) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < tasks.length; i++) {
                if (tasks[i]['isDeleted'] && tasks[i]['isDeleted'] == true) {
                    console.log('item deleted');
                    tasks.splice(i, 1);
                }
                if (((_a = tasks[i]) === null || _a === void 0 ? void 0 : _a.subTasks) && ((_b = tasks[i]) === null || _b === void 0 ? void 0 : _b.subTasks.length)) {
                    yield this.removeNull((_c = tasks[i]) === null || _c === void 0 ? void 0 : _c.subTasks);
                }
            }
        });
    }
    addTimeStamp(tasks) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            let len = tasks.length;
            for (let i = 0; i < len; i++) {
                tasks[i]['createdAt'] = new Date();
                if (((_a = tasks[i]) === null || _a === void 0 ? void 0 : _a.subTasks) && ((_b = tasks[i]) === null || _b === void 0 ? void 0 : _b.subTasks.length)) {
                    yield this.addTimeStamp((_c = tasks[i]) === null || _c === void 0 ? void 0 : _c.subTasks);
                }
            }
        });
    }
    /**
     * Returns single doucument of model specified by _id.
     */
    findById(res, documentId, errMsg = `Failed to find document ${documentId}`) {
    }
    /**
     * Returns single document from given model that matches the query.
     */
    findOne(res, query, errMsg = `Failed to find document ${query}`) {
    }
    findMany(res, query, errMsg = `Failed to find document ${query}`) {
    }
    /**
     * Updates single document,
     */
    updateById(res, documentId, document, errMsg = `Failed to update document ${documentId}`) {
    }
    /**
     * Deletes a single document selected by id
     */
    deleteById(res, documentId, errMsg = `Failed to delete document ${documentId}`) {
    }
    writeTasksToFile() {
        return __awaiter(this, void 0, void 0, function* () {
            fs_1.default.writeFile(path_1.default.join(__dirname, '../../tasks.json'), JSON.stringify(this.tasks), (error) => {
                if (error) {
                    throw new Error("Error in adding new field");
                }
            });
        });
    }
}
exports.BaseController = BaseController;
