const http = require("http");
const fs = require("fs");
const path = require("path");
const querystring = require("querystring");

const Handle = (req, res) => {
  // POST (form submit)
  if (req.method === "POST" && req.url === "/submit") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const data = querystring.parse(body);
      console.log("Form Data:", data);

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`<h1>Form Submitted</h1><a href="/">Go Home</a>`);
    });

    return;
  }

  let filename = "";

  switch (req.url) {
    case "/":
      filename = "home.html";
      break;
    case "/about":
      filename = "about.html";
      break;
    case "/contact":
      filename = "contact.html";
      break;
    default:
      filename = "404.html";
      break;
  }

  fs.readFile(path.join(__dirname, filename), (err, data) => {
    if (err) {
      res.writeHead(500);
      res.end("Server Error");
      return;
    }

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  });
};

http.createServer(Handle).listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
