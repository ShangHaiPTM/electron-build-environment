/**
 * Created by colinhan on 07/11/2016.
 */

const co = require('co');
const Sequelize = require('sequelize');
const QueryInterface = require('sequelize/lib/query-interface');
const Umzug = require('umzug');
const path = require('path');
const sequelize = require('../sequelize');
const seeders = require('../seeders');

const queryInterface = new QueryInterface(sequelize);

const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize,
  },
  logging: false,
  upName: 'up',
  downName: 'down',
  migrations: {
    params: [queryInterface, Sequelize],
    path: path.join(__dirname, '../migrations'),
    pattern: /^\d+[\w-]+\.js$/,
    wrap(fun) { return fun; }
  }
});

function up() {
  co(function*() {
    yield umzug.up({});
    yield seeders();
  }).catch(console.error);
}

function down() {
  umzug.down({});
}

module.exports = { up, down };
