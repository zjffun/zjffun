const toc = require("mdast-util-toc");
const html = require("remark-html");

export default function attacher(options) {
  const { dom } = options;
  return function transformer(tree) {
    const node = toc(tree).map;
    if (node && dom) {
      dom.innerHTML = new html().Compiler(node, {});
    }
  };
}
