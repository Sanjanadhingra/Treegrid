"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express = require("express");
const socket_service_1 = require("./services/socket.service");
class App {
    /**
     * @param port Port Application listens on
     * @param middleware Array of middleware to be applied to app
     * @param routes Array of express.Router objects for application routes
     * @param apiPath Base path for this api that will be prepended to all routes
     * @param staticPath path to folder for public files express will make available
     */
    constructor(port, middleware, routes, apiPath) {
        this.port = port;
        this.apiPath = apiPath;
        //* Create a new express app
        this.app = express();
        //* Method calls `this.app.use()` for each middleware
        this.middleware(middleware);
        //* Method calls `this.app.use()` for each router, prepending `this.apiPath` to each router
        this.routes(routes);
        //* Method calls `this.app.use(express.static(path))` to enable public access to static files
    }
    /**
     * @param mware Array of middlewares to be loaded into express app
     */
    middleware(mware) {
        mware.forEach((m) => {
            this.app.use(m);
        });
    }
    addMiddleWare(middleWare) {
        this.app.use(middleWare);
    }
    /**
     * Attaches route objects to app, appending routes to `apiPath`
     * @param routes Array of router objects to be attached to the app
     */
    routes(routes) {
        routes.forEach((r) => {
            this.app.use(`${this.apiPath}`, r);
        });
    }
    /**
     * Start the Express app
     */
    listen() {
        this.socketServer();
    }
    socketServer() {
        const server = require('http').createServer(this.app);
        const io = require('socket.io')(server);
        server.listen(this.port, () => {
            console.log('server connected to', this.port);
        });
        let obj = new socket_service_1.SocketService(io);
    }
}
exports.App = App;
