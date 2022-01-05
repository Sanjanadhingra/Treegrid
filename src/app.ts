

import { Application } from "express";
import express = require("express");

export class App {
    public app: Application;

    /**
     * @param port Port Application listens on
     * @param middleware Array of middleware to be applied to app 
     * @param routes Array of express.Router objects for application routes
     * @param apiPath Base path for this api that will be prepended to all routes
     * @param staticPath path to folder for public files express will make available
     */
    constructor(
        private port: number,
        middleware: Array<any>,
        routes: Array<express.Router>,
        private apiPath:string,
    ) {
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
    private middleware(mware: any[]) {
        mware.forEach((m) => {
            this.app.use(m);
        });
    }

    public addMiddleWare(middleWare: any) {
        this.app.use(middleWare);
    }

    /**
     * Attaches route objects to app, appending routes to `apiPath`
     * @param routes Array of router objects to be attached to the app
     */
    private routes(routes: Array<express.Router>) {
        routes.forEach((r) => {
            this.app.use(`${this.apiPath}`, r);
        });
    }

    /**
     * Start the Express app
     */
    public listen() {
        this.app.listen(this.port, () => {
            console.log("APP LISTENING ON PORT:", this.port);
        });
    }
}