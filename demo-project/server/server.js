// @flow

import path from 'path';
import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import PrettyError from 'pretty-error';
import config from 'config';

import addMiddlewars from './middlewares/index';
import api from './api';

process.on('SIGTERM', () => {
  setTimeout(() => {
    process.exit();
  }, 1000);
});

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(morgan((config.tracer && config.tracer.morganFormat) || 'combined'));
app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

api(app);

addMiddlewars(app);

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
app.listen(config.get('server.port'), () => {
  console.log(`The server is running at http://localhost:${config.get('server.port')}/`);
});
/* eslint-enable no-console */

//
// Launch the push service
// -----------------------------------------------------------------------------

