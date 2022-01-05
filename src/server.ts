
import { App } from "./app";
import { middleware } from "./middleware";
import { routerTemplate } from "./routes/example.router";

const port: number =  8080;
/**
 * Configure App instance
 */

const app = new App(
  port,
  middleware,
  [routerTemplate], //* Add your express router objects here
  "/api"
);

/**
 * Launch!
 */
app.listen();