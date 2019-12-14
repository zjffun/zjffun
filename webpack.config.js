const path = require("path");

module.exports = {
  entry: "./src/note.js",
  output: {
    filename: "note.js",
    path: path.resolve(__dirname, "dist")
  }
};
