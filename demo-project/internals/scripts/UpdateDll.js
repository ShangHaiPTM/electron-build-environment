const config = require('../../package.json');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const dllDeps = _.toPairs(config.dllDependencies);
const deps = _.toPairs(config.dependencies);

config.dllDependencies = _.fromPairs(
  _.sortBy(
    _.concat(
      _.intersectionBy(dllDeps, deps, e => e[0]),
      _.map(
        _.differenceBy(deps, dllDeps, e => e[0]),
        p => [p[0], false]
      )
    )
  )
);

fs.writeFileSync(path.resolve(__dirname, '../../package.json'), JSON.stringify(config, '', '  '));
