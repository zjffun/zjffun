import hljs from "highlight.js";
import { createElement } from "./util/zdom";
import replaceImgURL from "./note/replace-img-url";
import generateTOC from "./note/generate-toc";
var unified = require("unified");
var markdown = require("remark-parse");
var html = require("remark-html");
var slug = require("remark-slug");

/* css */
import "github-markdown-css";
import "highlight.js/styles/github.css";

const BASE_URL = "http://localhost:3000";
const catalogue = document.querySelector(".catalogue");
const content = document.querySelector(".content");
const toc = content.querySelector(".js-note-toc");
const noteContent = content.querySelector(".js-note-content");
const noteTitle = content.querySelector(".js-note-title");

/* onload */
fetch(BASE_URL + "/api/note/list")
  .then(d => d.json())
  .then(d => {
    document
      .querySelector(".catalogue")
      .append(createCatalogue(d, "/").querySelector("ul"));
  });

render();

/* envet listener */
window.addEventListener("popstate", function({ state }) {
  if (state === "") {
    console.log(state);
    render();
  }
});
catalogue.addEventListener("click", function(e) {
  e.preventDefault();
  const target = e.target;
  const href = target.getAttribute("href");
  if (href) {
    window.history.pushState("", "", href);
    render();
  }
});
document.querySelector(".js-back").addEventListener("click", function(e) {
  e.preventDefault();
  window.history.pushState("", "", location.origin + location.pathname);
  render();
});

function render() {
  const params = new URL(document.location).searchParams;
  let path = params.get("path");
  if (path) {
    renderContent(path);
    show("content");
  } else {
    show("catalogue");
  }
}

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
        { href: "?path=" + window.encodeURIComponent(path + d.name) },
        d.name
      )
    );
  }
  return createElement("li", {}, children);
}

function renderContent(path) {
  const api = BASE_URL + "/api/note/get";
  fetch(api + path)
    .then(d => d.text())
    .then(d => {
      unified()
        .use(markdown)
        .use(replaceImgURL, { prefix: api + path + "/../" })
        .use(slug)
        .use(generateTOC, { dom: toc })
        .use(html)
        .process(d, function(err, file) {
          noteContent.innerHTML = String(file);
          noteTitle.innerText = path.replace(/^.*\/([^\/]*).md$/, "$1");
          content.querySelectorAll("pre code").forEach(block => {
            hljs.highlightBlock(block);
          });
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
