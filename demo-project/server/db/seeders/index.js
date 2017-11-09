/**
 * Created by colinhan on 07/11/2016.
 */

const co = require('co');
const fs = require('fs');
const path = require('path');

const seeders = fs.readdirSync(__dirname)
    .filter(file => file !== 'index.js' && file.slice(-3) === '.js')
    .sort();

module.exports = co.wrap(function* seeder() {
  for (let i = 0; i < seeders.length; i++) {
    const s = path.join(__dirname, seeders[i]);
    const seederFunc = require(s);
    yield seederFunc();
  }
});
