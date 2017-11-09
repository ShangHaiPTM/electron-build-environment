require('babel-register');

process.env.NODE_ENV = 'development';
module.exports = require('./webpack.config.app.renderer.dev');
