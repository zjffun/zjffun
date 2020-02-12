const visit = require("unist-util-visit");
const is = require("unist-util-is");

const isImgExt = str => /\.(svg|png|jpg|jpeg|gif)$/.test(str);

export default function attacher(options) {
  const { prefix } = options;
  return function transformer(tree) {
    visit(tree, visitor(prefix));
  };
}

function visitor(prefix) {
  return function(node) {
    if (
      is(node, "image") &&
      isImgExt(node.url) &&
      !/^(https?)|(ftp):\/\//.test(node.url)
    ) {
      node.url = prefix + node.url;
    }
  };
}
