const fs = require("fs");
const path = require("path");

const mime = require("mime/lite");

const response = require("./response");

module.exports = function sendStatic(pathname, cb) {
  const abspath = path.join(
    __dirname,
    "assets",
    pathname.replace(/(^|\/)\.\.?(\/|$)/g, "/")
  );
  fs.readFile(abspath, (err, content) => {
    if (err) {
      console.log(
        "failed to get static file",
        pathname + ":",
        err.message.replace(abspath, "<path>")
      );
      return cb(null, response.notFound());
    }
    cb(null, response.success(content, mime.getType(path.extname(pathname))));
  });
};
