const express = require("../node_modules/express");
const app = express();
const ejs = require("../node_modules/ejs");
LRU = require("../node_modules/lru-cache");

// app configuration
app.use(express.json());

// ejs configuration
app.set("view engine", "ejs");
ejs.delimiter = "%";
ejs.cache = new LRU(100); // LRU cache with 100-item limit

app.get("/", (req, res) => {
  res.send("Welcome To App");
});

app.get("/resRender", (req, res) => {
  res.render("index", {
    user: "sharath",
    navs: "home about pages",
    footer: "my address , copyright , contact"
  });
});

app.get("/appRender", (req, res) => {
  app.render(
    "index",
    {
      user: "sharath",
      navs: "home about pages",
      footer: "my address , copyright , contact"
    },
    (err, html) => {
      if (!err) {
        return res.send(html);
      }
      res.send(err);
    }
  );
});

app.get("/appRender2", (req, res) => {
  app.render(
    "index",
    {
      user: "sharath",
      navs: "home about pages",
      footer: "my address , copyright , contact"
    },
    (err, html) => {
      if (!err) {
        return res.send(
          html + " <div> This is directly appending to html from server</div>"
        );
      }
      res.send("err");
    }
  );
});

app.get("/ejsRender", (req, res) => {
  ejs.delimiter = "$"; // this has local scope
  let rendered = ejs.render("<div> <$= name $> </div>", { name: "sharath" });
  res.send(rendered);
});

app.get("/ejsRender2", (req, res) => {
  let rendered = ejs.render(
    "<div> <?= name ?> </div>",
    { name: "sharath" },
    { delimiter: "?" }
  );
  res.send(rendered);
});

app.get("/ejsRender3", (req, res) => {
  let rendered = ejs.compile("<?= name ?>", { delimiter: "?" });
  res.send(rendered({ name: "sharath" }));
});

app.get("/ejsRender4", (req, res) => {
  let rendered = ejs.renderFile(
    "./views/partials/nav.ejs",
    { name: "sharath", navs: "home about pages", fromMain: " nothing " },
    { delimiter: "%" },
    (err, str) => {
      if (!err) {
        res.send(str);
      }
    }
  );
});

// listening on port
let port = 3000;
app.listen(port, () => {
  console.log("listening on " + port);
});

/**
 * TIPS : create - layout/layout.ejs , partial/ , pages/ folder in views
 * render layout.ejs always and pass render parameter as which page.ejs you need to render
 * res.render("layout", { page : "index"});
 */
