"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const columnGrid_json_1 = require("../columnGrid.json");
/**
 * Provides functions to be used with express routes. Serves common CRUD fuctionality.
 */
class BaseController {
    constructor() {
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
            console.log(columnGrid_json_1.columnData);
            this.jsonRes(columnGrid_json_1.columnData, res);
        }
        catch (error) {
            this.errRes(error, res, errMsg, 404);
        }
    }
    editColumn(req, res, errMsg = `Failed to find document `) {
        let objIndex;
        console.log(req.params.name);
        objIndex = columnGrid_json_1.columnData.findIndex((obj => obj.name == req.params.name));
        console.log(objIndex);
        //columnData[objIndex] = req
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
