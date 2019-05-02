const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const mkdirp = promisify(require('mkdirp'));
const request = require('request-promise');

const yamlHeadmatter = require('./yaml-headmatter.js');
const processReadme = require('./process-readme.js');

const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const cwd = process.cwd();

const types = ['loaders', 'plugins'];

const pathMap = {
  loaders: path.resolve(__dirname, '../content/loaders'),
  plugins: path.resolve(__dirname, '../content/plugins')
};

async function main() {
  for (const type of types) {
    const outputDir = pathMap[type];

    await mkdirp(outputDir);

    const repos = JSON.parse(await readFile(path.resolve(__dirname, `../../repositories/${type}.json`)));

    for (const repo of repos) {
      const [org, packageName] = repo.split('/');
      const url = `https://raw.githubusercontent.com/${repo}/master/README.md`;
      const htmlUrl = `https://github.com/${repo}`;
      const editUrl = `${htmlUrl}/edit/master/README.md`;
      const fileName = path.resolve(outputDir, `_${packageName}.md`);

      let title = packageName;

      if (type === 'plugins') {
        title = _.camelCase(title);
        title = _.upperFirst(title);
        title = title.replace(/I18N/, 'I18n');
      }

      // generate yaml matter for file
      let headmatter = yamlHeadmatter({
        title: title,
        source: url,
        edit: editUrl,
        repo: htmlUrl
      });

      request(url)
        .then(async content => {
          const body = processReadme(content, { source: url });

          await writeFile(fileName, headmatter + body);

          console.log('Generated:', path.relative(cwd, fileName));
        })
        .catch(err => {
          throw err;
        });
    }
  }
}

main();

