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
/**
 * Provides functions to be used with express routes. Serves common CRUD fuctionality.
 */
class BaseController {
    constructor(columndata, task) {
        this.columnData = columndata;
        this.tasks = task;
        this.lastIndexOfColumn = Number(Object.keys(this.columnData)[Object.keys(this.columnData).length - 1]);
        this.lastIndexOfRow = Number(Object.keys(this.tasks)[Object.keys(this.tasks).length - 1]);
    }
    jsonRes(doc, res) {
        res.status(200).json(doc);
    }
    errRes(err, res, message = 'Sever Error', status = 500) {
        res.status(status).json({ error: message });
    }
    /**
     * Returns all documents of model
     */
    // findColumns(res: Response, errMsg = 'Failed to find documents') {
    //     try {
    //         this.jsonRes(Object.values(this.columnData), res)
    //     }
    //     catch (error) {
    //         this.errRes(error, res, errMsg, 404)
    //     }
    // }
    getColumns() {
        return Object.values(this.columnData);
    }
    getRowsData() {
        return Object.values(this.tasks);
    }
    editColumn(id, data) {
        delete data.id;
        this.columnData[id] = data;
        fs_1.default.writeFile(path_1.default.join(__dirname, '../../columnGrid.json'), JSON.stringify(this.columnData), (err) => {
            console.log(err);
        });
        return this.columnData[id];
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
            yield this.addFieldInRows(data.column.field, data.column.defaultValue);
        });
    }
    deleteColumn(data) {
        try {
            delete this.columnData[data.field];
            fs_1.default.writeFile(path_1.default.join(__dirname, '../../columnGrid.json'), JSON.stringify(this.columnData), (error) => {
                if (error) {
                    throw new Error("couldn't update file");
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }
    getRows(res, errMsg = 'Failed to find documents') {
        try {
            console.log(this.tasks);
            this.jsonRes(Object.values(this.tasks), res);
        }
        catch (error) {
            this.errRes(error, res, errMsg, 404);
        }
    }
    addFieldInRows(field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            Object.values(this.tasks).forEach((element) => {
                element[field] = value;
            });
            fs_1.default.writeFile(path_1.default.join(__dirname, '../../tasks.json'), JSON.stringify(this.tasks), (error) => {
                if (error) {
                    throw new Error("Error in adding new field");
                }
            });
        });
    }
    deleteRow(id) {
        id.forEach(element => delete this.tasks[element]);
        fs_1.default.writeFile(path_1.default.join(__dirname, '../../tasks.json'), JSON.stringify(this.tasks), (error) => {
            if (error) {
                throw new Error("couldn't update file");
            }
        });
        return this.tasks;
    }
    editRow(id, data) {
        delete data.id;
        this.tasks[id] = data;
        fs_1.default.writeFile(path_1.default.join(__dirname, '../../tasks.json'), JSON.stringify(this.tasks), (error) => {
            if (error) {
                throw new Error("couldn't update file");
            }
            else {
                console.log("data created successfully");
            }
        });
        return this.tasks[id];
    }
    addRow(req, res, errMsg = `Failed to add document `) {
        try {
            this.lastIndexOfRow = this.lastIndexOfRow + 1;
            let stringLastIndexOfRow = JSON.parse(JSON.stringify(this.lastIndexOfRow));
            if (req.body.isParent === true) {
                let parentId = req.params.taskId;
            }
            // else {
            //     parentId = -1
            // }
            let keyValues = Object.entries(this.tasks);
            keyValues.splice(req.body.index, 0, [stringLastIndexOfRow.toString(), Object.assign(Object.assign({}, req.body), { parentId: req.params.taskID })]);
            this.tasks = Object.fromEntries(keyValues);
            fs_1.default.writeFile(path_1.default.join(__dirname, '../../columnGrid.json'), JSON.stringify(this.tasks), (error) => {
                if (error) {
                    throw new Error("couldn't add new column");
                }
            });
            this.jsonRes(this.tasks, res);
        }
        catch (error) {
            this.errRes(error, res, errMsg, 404);
        }
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
}
exports.BaseController = BaseController;
