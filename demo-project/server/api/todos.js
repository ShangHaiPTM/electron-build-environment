/**
 * Created by colinhan on 9/18/16.
 */

// @flow
import express from 'express';
import type { $Request, $Response } from 'express';
import { todos } from '../controllers';

const router = new express.Router();

router.get(
  '/helloTodos',
  (req: $Request, res: $Response) =>
    res.status(200).send({
      message: 'Welcome to the Todos API',
    })
);

router.post('/todos', todos.create);

export default { path: '/api', router };
