import { createElement } from "./util/zdom";
import replaceImgURL from "./note/replace-img-url";
import generateTOC from "./note/generate-toc";
var unified = require("unified");
var markdown = require("remark-parse");
var html = require("remark-html");
var slug = require("remark-slug");

const BASE_URL = "http://localhost:3000";
const catalogue = document.querySelector(".catalogue");
const content = document.querySelector(".content");
const toc = content.querySelector(".js-note-toc");

/* onload */
fetch(BASE_URL + "/api/note/list")
  .then(d => d.json())
  .then(d => {
    document
      .querySelector(".catalogue")
      .append(createCatalogue(d, "/").querySelector("ul"));
  });

show("catalogue");

/* envet listener */
catalogue.addEventListener("click", function(e) {
  e.preventDefault();
  const target = e.target;
  const href = target.getAttribute("href");
  if (href) {
    renderContent(href);
    show("content");
  }
});
document.querySelector(".js-back").addEventListener("click", function(e) {
  e.preventDefault();
  show("catalogue");
});

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
    children.push(
      createElement(
        "a",
        { href: BASE_URL + "/api/note/get" + path + d.name },
        d.name
      )
    );
  }
  return createElement("li", {}, children);
}

function renderContent(url) {
  fetch(url)
    .then(d => d.text())
    .then(d => {
      unified()
        .use(markdown)
        .use(replaceImgURL, { prefix: url + "/../" })
        .use(slug)
        .use(generateTOC, { dom: toc })
        .use(html)
        .process(d, function(err, file) {
          content.querySelector(".js-note-content").innerHTML = String(file);
        });
    });
}

function show(name) {
  switch (name) {
    case "catalogue":
      catalogue.style.display = "block";
      content.style.display = "none";
      break;
    default:
      catalogue.style.display = "none";
      content.style.display = "block";
      break;
  }
}
