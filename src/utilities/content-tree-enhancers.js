const fs = require('fs');
const path = require('path');
const frontMatter = require('front-matter');
const remark = require('remark');
const slug = require('remark-slug');
const visit = require('unist-util-visit');

const enhance = (tree, options) => {
  // delete `./` root directory on node
  const dir = path.normalize(options.dir).replace(/^(\.\/)/gm, '');

  tree.url = tree.path
    // delete `.md` extensions
    .replace(tree.extension, '')
    // delete source content directory
    .replace(dir, '')
    // Normalize url for Windows
    .replace(/\\/g, '/')
    // remove `index` for root urls
    .replace(/\/index$/, '')
    // replace empty strings with `/`
    .replace(/^$/, '/')
    // delete trailing dots for node
    .replace(/^(\.)/g, '');

  if (tree.type === 'file') {
    let anchors = [];
    let content = fs.readFileSync(tree.path, 'utf8');
    let { attributes } = frontMatter(content);

    // remove underscore from fetched files
    if (tree.name[0] === '_') {
      tree.name = tree.name.replace('_', '');
      tree.url = tree.url.replace('_', '');
    }

    remark()
      .use(slug)
      .use(extractAnchors, { anchors, levels: true })
      .process(content, err => {
        if (err) {
          throw err;
        }
      });

    tree.anchors = anchors;

    Object.assign(
      tree,
      {
        path: tree.path.replace(/\\/g, '/')
      },
      attributes
    );
  }
};

const filter = item => true;

const sort = (a, b) => {
  let group1 = (a.group || '').toLowerCase();
  let group2 = (b.group || '').toLowerCase();

  if (group1 < group2) return -1;
  if (group1 > group2) return 1;
  if (a.sort && b.sort) return a.sort - b.sort;

  let aTitle = (a.title || '').toLowerCase();
  let bTitle = (b.title || '').toLowerCase();
  if (aTitle < bTitle) return -1;
  if (aTitle > bTitle) return 1;

  return 0;
};

function extractAnchors(options = {}) {
  let { anchors, levels } = options;

  if (!Array.isArray(anchors)) {
    throw new Error('Missing or malformed `anchors` in options.');
  }

  return function transformer(ast) {
    visit(ast, 'heading', visitor);
  };

  function visitor(node) {
    // TODO: Default header `levels` and check it to filter the `push`ed anchors
    let anchor = {
      title: node.children.length ? node.children[0].value : '',
      id: node.data.id
    };
    levels && (anchor.level = node.depth);
    options.anchors.push(anchor);
  }
}

function restructure(item, options) {
  enhance(item, options);

  if (item.children) {
    item.children.forEach(child => restructure(child, options));

    item.children.filter(filter);
    item.children.sort(sort);
  }

  return item;
}

module.exports = {
  enhance,
  filter,
  restructure,
  sort
};
