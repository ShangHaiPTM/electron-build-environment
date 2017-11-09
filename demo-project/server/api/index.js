// @flow
import type {
  $Application
} from 'express';

import auth from './auth';
import todos from './todos';

const modules = [
  auth,
  todos,
  // register modules here
];

export default function (app: $Application) {
  modules.forEach(
    (module: *) => {
      if (typeof module === 'function') {
        module(app);
      } else {
        const path = module.path || '/';
        app.use(path, module.router);
      }
    });
}
