import {IncomingMessage, ServerResponse} from "http";
import ErrnoException = NodeJS.ErrnoException;

const fs = require("fs");

export const routes = (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;

    const pickResponse = (url: string): any => {
        const homePage = "<html>" +
            "<header><title>Node server</title></header>" +
            "<body>Hello to my node server<form action='/message' method='POST'><input type='text' name='message'><button type='submit'>send</button></form></body>" +
            "</html>"
        const responses: { [index: string]: string } = {
            "/": homePage
        };
        return responses[url] ?? "<html><body>not thing</body></html>";
    }
    const submit = () => {
        const body: any[] = [];
        req.on("data", (chunk) => {
            body.push(chunk)
        })
        req.on("end", () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split("=")[1];
            fs.writeFile("message.txt", message, (error: ErrnoException) => {
                res.statusCode = 302;
                res.setHeader("Location", "/");
                return res.end();
            });
        });
    }
    const defaultResponse = () => {
        res.setHeader("ContentType", "text/html");
        res.write(pickResponse(url ?? "/"))
        return res.end();
    }
    url === "/message" && method === "POST" ? submit() : defaultResponse();
}