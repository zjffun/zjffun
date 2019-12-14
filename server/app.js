const fs = require("fs");
const path = require("path");

const koaLogger = require("koa-logger");
const router = require("koa-router")();
const koaBody = require("koa-body");
const Koa = require("koa");

const app = (module.exports = new Koa());

// middleware

app.use(koaLogger());

app.use(koaBody());

// route definitions

router.get("/note/list", list);

app.use(router.routes());

async function list(ctx) {
  const dir = "C:\\Users\\zjffu\\github\\note";

  const json = getFileAndDirRecursively(dir);

  function getFileAndDirRecursively(pathPara) {
    const json = {};
    const stat = fs.statSync(pathPara);
    json.name = path.basename(pathPara);

    if (stat.isDirectory()) {
      json.children = [];
      json.type = "dir";

      const paths = fs.readdirSync(pathPara);
      paths.forEach(p => {
        if (p.indexOf(".") !== 0 && p !== 'node_modules') {
          const tjson = getFileAndDirRecursively(path.join(pathPara, p));
          if (tjson.type === "dir" || tjson.ext === ".md") {
            json.children.push(tjson);
          }
        }
      });
    } else {
      json.type = "file";
      json.ext = path.extname(pathPara);
    }

    return json;
  }

  ctx.body = json;
}

// listen
if (!module.parent) app.listen(3000);
