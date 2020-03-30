const express = require("../node_modules/express");
const app = express();
const path = require("path");

const AvatarService = require("./middleware/avatarService");
const avatars = new AvatarService(path.join(__dirname, "avatars"));
const middlewares = require("./middleware/uploadService");

// app configuration
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./index.html"));
});

app.post("/profile", async (req, res) => {
  middlewares.upload.single("avatar")(req, res, err => {
    if (err) {
      return res.status(400).send("Something went wrong!");
    }
    return res.send(req.file.originalname + " uploaded successfully");
  });
});

app.post("/photos", middlewares.upload.array("photos", 3), async (req, res) => {
  try {
    let names = req.files.map(i => i.originalname);
    res.send(`[${names}] photos uploaded`);
  } catch (err) {
    res.send("error accured");
  }
});

app.post(
  "/mixedFiles",
  middlewares.upload.fields([
    { name: "word", maxCount: 2 },
    { name: "excel", maxCount: 2 }
  ]),
  async (req, res) => {
    try {
      res.send("uploaded");
    } catch (err) {
      res.send("error accured");
    }
  }
);

/**
 * Accept only text fields. If any file upload is made, error with code "LIMIT_UNEXPECTED_FILE"
 * will be issued
 */
app.post("/textOnly", middlewares.upload.none(), async (req, res) => {
  try {
    res.send("uploaded");
  } catch (err) {
    res.send("error accured");
  }
});

/**
 * Accepts all files that comes over the wire. An array of files will be stored in req.files
 */
app.post("/anyFiles", middlewares.upload.any(), async (req, res) => {
  try {
    try {
      let names = req.files.map(i => i.originalname);
      res.send(`[${names}] photos uploaded`);
    } catch (err) {
      res.send("error accured");
    }
  } catch (err) {
    res.send("error accured");
  }
});

// using sharp
app.post(
  "/sharpProfile",
  middlewares.upload.single("sharpAvatar"),
  middlewares.handleAvatar(avatars),
  async (req, res) => {
    try {
      // update the image name to database and receive it next time
      return res.send(req.file.srotedFilename + " uploaded successfully");
    } catch (err) {
      return res.status(err.status).send("Something went wrong!");
    }
  }
);

app.get("/getPhoto/:filename", async (req, res) => {
  res.type("png");
  // if we want to send full image
  return res.sendFile(avatars.filepath(req.params.filename));

  // to create a thumbnail 50 * 50
  const file = await avatars.thumbnail(req.params.filename);
  return res.end(file, "binary");
});

// listening on port
let port = 3000;
app.listen(port, () => {
  console.log("listening on " + port);
});
