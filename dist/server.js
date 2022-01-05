"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const middleware_1 = require("./middleware");
const example_router_1 = require("./routes/example.router");
const port = 8080;
/**
 * Configure App instance
 */
const app = new app_1.App(port, middleware_1.middleware, [example_router_1.routerTemplate], //* Add your express router objects here
"/api");
/**
 * Launch!
 */
app.listen();
