import {IncomingMessage, ServerResponse} from "http";

const http = require("http");
const fs = require("fs");

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
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
            console.info(chunk, typeof chunk);
            body.push(chunk)
        })
        req.on("end", () => {
            const parsedBody = Buffer.concat(body).toString();
            const message = parsedBody.split("=")[1];
            fs.writeFileSync("message.txt", message);
        });
        res.statusCode = 302;
        res.setHeader("Location", "/");
    }
    url === "/message" && method === "POST" && submit();
    res.setHeader("ContentType", "text/html");
    res.write(pickResponse(url ?? "/"))
    res.end();
}

const server = http.createServer(requestListener);

server.listen(3000)