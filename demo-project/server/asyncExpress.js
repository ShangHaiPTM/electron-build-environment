// @flow
import type {
  $Request,
  $Response,
  Middleware,
  NextFunction
} from 'express';

export default function wrap(fn: Middleware) {
  if (fn.length <= 3) {
    return (req: $Request, res: $Response, next: NextFunction) =>
      fn(req, res, next).catch(next);
  }
  return (err: Error, req: $Request, res: $Response, next: NextFunction) =>
    fn(err, req, res, next).catch(next);
}
