const fs = require("fs");
const path = require("path");

const koaLogger = require("koa-logger");
const router = require("koa-router")();
const koaBody = require("koa-body");
const Koa = require("koa");
const cors = require("@koa/cors");
const send = require("koa-send");

const noteDir = "C:\\Users\\zjffu\\github\\note";

const app = (module.exports = new Koa());

// middleware

app.use(koaLogger());

app.use(koaBody());

app.use(cors());

// route definitions

router.get("/api/note/list", list);
router.get("/api/note/get/(.*)", getNote);

app.use(router.routes());

async function list(ctx) {
  const dir = noteDir;

  const json = getFileAndDirRecursively(dir);

  function getFileAndDirRecursively(pathPara) {
    const obj = {};
    const stat = fs.statSync(pathPara);
    obj.name = path.basename(pathPara);

    if (stat.isDirectory()) {
      obj.children = [];
      obj.type = "dir";

      const paths = fs.readdirSync(pathPara);
      paths.forEach(p => {
        if (p.indexOf(".") !== 0 && p !== "node_modules") {
          const tobj = getFileAndDirRecursively(path.join(pathPara, p));
          if (tobj.type === "dir" || tobj.ext === ".md") {
            obj.children.push(tobj);
          }
        }
      });
    } else {
      obj.type = "file";
      obj.ext = path.extname(pathPara);
    }

    return obj;
  }

  ctx.body = json;
}

async function getNote(ctx) {
  const basePath = path.join("/api/note/get", path.basename(noteDir));
  let relPath = path.relative(basePath, ctx.path) || "/";
  await send(ctx, relPath, { root: noteDir });
}
// listen
if (!module.parent) app.listen(3000);
