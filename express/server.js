const express = require("../node_modules/express");
const app = express();
const ejs = require("../node_modules/ejs");
LRU = require("../node_modules/lru-cache");

// app configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "./static")));

app.get("/", (req, res) => {
  res.send("Welcome To App");
});

// listening on port
let port = 3000;
app.listen(port, () => {
  console.log("listening on " + port);
});
