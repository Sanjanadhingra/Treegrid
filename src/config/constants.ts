
'use strict';

const SERVER:unknown = {
    APP_NAME: 'gridTree',
    PORTS: {
        development: 3000,
    },
    DOMAIN_NAME: 'https://api.tree-grid.com/',
};

const STATUS_MSG:unknown = {
    SUCCESS: {
        DEFAULT: {
            statusCode: 200,
            message: 'Success',
            data: {}
        },
        STATUS: {
            statusCode: 200,
            message: 'Status has been changed successfully',
            type: 'DEFAULT',
            data: {}
        },
    },
};

const SOCKET_EVENT:unknown = {
   CONNECTION: 'connection',
   COLUMN_ADD: 'addColumn',
   COLUMN_EDIT: 'editColumn',
   COLUMN_DELETE: 'deleteColumn',
   ROW_ADD: 'addRow',
   ROW_EDIT: 'editRow',
   ROW_DELETE: 'deleteRow'
}
export const APP_CONSTANTS = {
    SERVER: SERVER,
    STATUS_MSG: STATUS_MSG,
    SOCKET_EVENT: SOCKET_EVENT
};
