import {IncomingMessage, ServerResponse} from "http";
import {routes} from "./routes";

const http = require("http");

const server = http.createServer(routes);

server.listen(3000)