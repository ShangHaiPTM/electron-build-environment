import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import fsEx from 'fs-extra';

import pkg from '../../package.json';

const targetDir = path.resolve(__dirname, '../../dist/app');

function buildAppPackage() {
  const dpts = _.toPairs(pkg.dependencies);
  const appExternalDpts = _.toPairs(pkg.app.externalDependencies);

  // noinspection SpellCheckingInspection
  const appPackage = {
    name: pkg.name,
    productName: pkg.productName,
    version: pkg.version,
    description: pkg.description,
    homepage: pkg.homepage,
    licence: pkg.licence,
    author: pkg.author,
    repository: pkg.repository,
    build: pkg.build,
    main: './main.prod.js',
    scripts: {
      postinstall: 'npm rebuild --runtime=electron' +
      ' --target=1.6.6' +
      ' --disturl=https://atom.io/download/atom-shell' +
      ' --build-from-source'
    },
    dependencies: _.fromPairs(
      _.intersectionBy(dpts, appExternalDpts, e => e[0])
    ),
  };

  const targetPath = path.resolve(targetDir, 'package.json');

  fs.writeFileSync(targetPath, JSON.stringify(appPackage, null, '  '));
}

function buildMainHtml() {
  const targetPath = path.resolve(targetDir, 'app.html');
  const sourcePath = path.resolve(__dirname, '../../app/app.html');
  fsEx.copySync(sourcePath, targetPath);
}

buildAppPackage();
buildMainHtml();
