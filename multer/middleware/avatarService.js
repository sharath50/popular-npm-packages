let sharp = require("sharp");
let { uuid } = require("uuidv4");
let util = require("util");
let path = require("path");
let fs = require("fs");

const fsunlink = util.promisify(fs.unlink);

class AvatarService {
  constructor(directory) {
    this.directory = directory;
  }

  async store(buffer) {
    const filename = AvatarService.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer)
      .resize(300, 300, {
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(filepath);
    return filename;
  }

  async delete(filename) {
    return fsunlink(this.filepath(filename));
  }

  async thumbnail(filename) {
    return sharp(this.filepath(filename))
      .resize(50, 50)
      .toBuffer();
  }

  static filename() {
    return `${uuid()}.png`;
  }

  filepath(filename) {
    return path.resolve(`${this.directory}/${filename}`);
  }
}
module.exports = AvatarService;
