const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");

const port = 3001;

const server = http.createServer((req, res) => {
const reqUrl = url.parse(req.url, true);

  if (reqUrl.pathname === "/") {
    fs.readFile(path.join(__dirname, "todo.json"), "utf-8", (err, data) => {
      if (err) {
        res.end("Internal Server Error");
        return;
      }
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(data);
    });
  } else if (reqUrl.pathname === "/getdata") {
    fs.readFile(path.join(__dirname, "login.html"), "utf-8", (err, data) => {
      if (err) {
        res.end("Internal Server Error");
        return;
      }
      res.end(data);
    });
  } else if (reqUrl.pathname === "/style.css") {
    fs.readFile(path.join(__dirname, "style.css"), (err, data) => {
      if (err) {
        res.end("Internal Server Error");
        return;
      }
      res.end(data);
    });
  } else {
    res.end("Not Found");
  }
});
server.listen(port, () => {
  console.log(`Server running at ${port}`);
});
