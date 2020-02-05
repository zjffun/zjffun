import { createElement } from "./util/zdom";
var unified = require("unified");
var markdown = require("remark-parse");
var html = require("remark-html");

function createCatalogue(d, path) {
  const children = [];
  if (d.type === "dir") {
    const lis = [];
    children.push(createElement("a", {}, d.name));
    d.children.forEach(child => {
      lis.push(createCatalogue(child, path + d.name + "/"));
    });
    children.push(createElement("ul", {}, lis));
  } else {
    children.push(createElement("a", { href: path + d.name }, d.name));
  }
  return createElement("li", {}, children);
}
fetch("/api/note/list")
  .then(d => d.json())
  .then(d => {
    document
      .querySelector(".catalogue")
      .append(createCatalogue(d, "/").querySelector("ul"));
  });

document.querySelector(".catalogue").addEventListener("click", function(e) {
  e.preventDefault();
  const target = e.target;
  const href = target.getAttribute("href");
  if (href) {
    renderContent(href);
  }
});

function renderContent(url) {
  fetch(url)
    .then(d => d.text())
    .then(d => {
      unified()
        .use(markdown)
        .use(html)
        .process(d, function(err, file) {
          document.querySelector(".content").innerHTML = String(file);
        });
    });
}
