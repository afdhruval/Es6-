const http = require("http"); //import htttp
const fs = require("fs");

const Handle = (req, res) => {
  let filename = ""; // varible 

  // switch case for routing

  switch (req.url) {
    case "/":
      filename = "home.html";
      break;
    case "/about":
      filename = "about.html";
      break;
    default:
      filename = "404.html";
      break;
  }

  fs.readFile(filename, (err, result) => {
    if (!err) {
      res.end(result);
    }
  });
};

//create server
const server = http.createServer(Handle);

// listen the port
server.listen(3000, (req, res) => {
  console.log("server is runing on 3000");
});
