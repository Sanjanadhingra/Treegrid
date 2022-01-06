"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const fs_1 = __importDefault(require("fs"));
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
    findColumns(res, errMsg = 'Failed to find documents') {
        try {
            this.jsonRes(this.columnData, res);
        }
        catch (error) {
            this.errRes(error, res, errMsg, 404);
        }
    }
    editColumn(req, res, errMsg = `Failed to find document `) {
        try {
            let objIndex;
            objIndex = this.columnData.findIndex((obj => obj.name == req.params.name));
            if (objIndex === -1) {
                throw ("Couldn't find");
            }
            this.columnData[objIndex] = req.body;
            console.log("coll", this.columnData);
            var obj = {};
            obj["columnData"] = this.columnData;
            console.log(obj);
            fs_1.default.writeFile('../columnGrid.json', obj, (error) => {
                if (error) {
                    console.log(error);
                }
                else {
                    console.log("data craeted successfullt");
                }
            });
            for (let i = 0; i <= this.tasks.length; i++) {
                delete Object.assign(this.tasks[i], { [req.body.name]: this.tasks[i][req.params.name] })[this.tasks[i][req.params.name]];
                /// this.tasks[i][req.params.name] = this.tasks[i][]
            }
            this.jsonRes(this.tasks, res);
        }
        catch (error) {
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
