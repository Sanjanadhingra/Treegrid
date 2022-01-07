"use strict";
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
    editColumn(id, data) {
        this.columnData[id] = data;
        fs_1.default.writeFile(path_1.default.join(__dirname, '../../columnGrid.json'), JSON.stringify(this.columnData), (err) => {
            console.log(err);
        });
    }
    // editColumn(req: Request, res: Response, errMsg = `Failed to edit document `) {
    //     try {
    //         this.columnData[req.params.id] = req.body;
    //         fs.writeFile(path.join(__dirname, '../../columnGrid.json'), JSON.stringify(this.columnData), (error) => {
    //             if (error) {
    //                 throw new Error("couldn't update file");
    //             }
    //             else {
    //                 console.log("data craeted successfully")
    //             }
    //         });
    //         this.jsonRes(this.columnData, res)
    //     }
    //     catch (error) {
    //         this.errRes(error, res, errMsg, 404)
    //     }
    // }
    addColumn(req, res, errMsg = `Failed to add document `) {
        try {
            let arr = Object.keys(this.columnData);
            let data = Number(arr[arr.length - 1]) + 1;
            this.columnData[data] = Object.assign({ columnId: data }, req.body);
            fs_1.default.writeFile(path_1.default.join(__dirname, '../../columnGrid.json'), JSON.stringify(Object.assign({ columnId: data }, req.body)), (error) => {
                if (error) {
                    throw new Error("couldn't add new column");
                }
            });
            this.jsonRes(this.columnData, res);
        }
        catch (error) {
            this.errRes(error, res, errMsg, 404);
        }
    }
    deleteColumn(req, res, errMsg = `Failed to delete document `) {
        try {
            delete this.columnData[req.params.id];
            fs_1.default.writeFile(path_1.default.join(__dirname, '../../columnGrid.json'), JSON.stringify(this.columnData), (error) => {
                if (error) {
                    throw new Error("couldn't update file");
                }
            });
            this.jsonRes(this.columnData, res);
        }
        catch (error) {
            this.errRes(error, res, errMsg, 404);
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
    deleteRow(req, res, errMsg = `Failed to delete document `) {
        try {
            delete this.tasks[req.params.id];
            fs_1.default.writeFile(path_1.default.join(__dirname, '../../tasks.json'), JSON.stringify(this.tasks), (error) => {
                if (error) {
                    throw new Error("couldn't update file");
                }
            });
            this.jsonRes(this.tasks, res);
        }
        catch (error) {
            this.errRes(error, res, errMsg, 404);
        }
    }
    editRow(req, res, errMsg = `Failed to edit document`) {
        try {
            this.tasks[req.params.id] = req.body;
            fs_1.default.writeFile(path_1.default.join(__dirname, '../../tasks.json'), JSON.stringify(this.tasks), (error) => {
                if (error) {
                    throw new Error("couldn't update file");
                }
                else {
                    console.log("data craeted successfully");
                }
            });
            this.jsonRes(this.tasks, res);
        }
        catch (error) {
            this.errRes(error, res, errMsg, 404);
        }
    }
    addRow(req, res, errMsg = `Failed to add document `) {
        try {
            if (req.body.isParent === false) {
                console.log(this.tasks);
                const key2 = this.tasks[req.params.taskId];
                console.log(key2);
                // delete this.tasks.key2;
                // this.tasks.key3 = "value3";
                // this.tasks.key2 = key2;
            }
            // fs.writeFile(path.join(__dirname, '../../columnGrid.json'), JSON.stringify( { columnId: data, ...req.body }), (error) => {
            //     if (error) {
            //         throw new Error("couldn't add new column");
            //     }
            // })
            this.jsonRes(this.columnData, res);
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
