let multer = require("multer");
let path = require("path");

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, "../avatars"));
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname + "-" + Date.now() + ".png");
  }
});

function fileFilter(req, file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const upload = multer({
  //   storage: storage,
  //   fileFilter: fileFilter,
  limits: {
    fileSize: 4 * 1024 * 1024
  }
});

module.exports.upload = upload;

module.exports.handleAvatar = avatars => async (req, res, next) => {
  if (!req.file) return next(new Error("no file found"));
  if (req.file.mimetype !== "image/png" && req.file.mimetype !== "image/jpeg") {
    return next(new Error("file format is not supported"));
  }
  req.file.srotedFilename = await avatars.store(req.file.buffer);
  return next();
};
