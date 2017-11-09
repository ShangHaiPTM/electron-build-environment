/**
 * Created by colinhan on 9/18/16.
 */

// @flow
import _ from 'lodash';
import express from 'express';
import type { $Request, $Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import Sequelize from 'sequelize';
// import config from 'config';

import wrap from '../asyncExpress';
import type { User } from '../../app/models/index';

// TODO: fix me.
const models: any = {};
const cryptKey = 'shanghai ptm inc.'; // config.get('crypt.secret');
// import { models } from '../../../../common/database';

const router = new express.Router();

/**
 * Help methods and constants
 */
const nonAuthPaths = [
  /^(\/api)?\/login\/?/i, // GET /login or /api/login/
  /^(\/api)?\/register\/?/i, // GET /register or /api/register/
];
const defaultUserOptions = {
};
function redirectToLogin(req: $Request, res: $Response) {
  const url = `/login?path=${encodeURIComponent(req.originalUrl)}`;
  res.redirect(url);
}

/**
 * Sign in with local.
 */
passport.use(new LocalStrategy(
  (username, password, done) => {
    (async () => {
      try {
        if (username.toLowerCase() === 'admin' && password === 'admin') {
          return done(undefined, {
            id: '1',
            name: 'Admin',
            displayName: 'Admin',
            type: 'Admin',
            roles: ['Admin']
          });
        }
        return done(new Error('密码错误或用户不存在。'));
      } catch (err) {
        done(err);
      }
    })();
  }));

/**
 * Attach middleware
 */
router.use(expressJwt({
  secret: cryptKey,
  credentialsRequired: false,
  getToken(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.id_token) {
      return req.query.id_token;
    } else if (req.cookies && req.cookies.id_token) {
      return req.cookies.id_token;
    }
    return null;
  }
}));
router.use(passport.initialize());

/**
 * Response for login, logout and register.
 */
router.post('/login',
  (req: $Request, res: $Response, next: NextFunction) => {
    passport.authenticate('local',
      (err?: Error | null, user?: User) => {
        if (!user) {
          res.json({ success: false, err: err ? err.message : '未知错误。' });
          return;
        }

        req.user = ({
          id: user.id,
          name: user.name,
          displayName: user.displayName,
          type: user.type,
          avatar: user.avatar,
          roles: user.roles,
          isAuthenticated: true
        }: User);
        const expiresIn = 60 * 60 * 24 * 30; // 30 days
        const token = jwt.sign(req.user, cryptKey, { expiresIn });
        if (req.query.device && req.query.device === 'm' /* mean mobile */) {
          res.json({
            id_token: token,
            userType: req.user.type,
          });
        } else {
          const cookieOptions = { maxAge: 1000 * expiresIn };
          res.cookie('id_token', token, { ...cookieOptions, httpOnly: true });
          res.json({ success: true, user: req.user });
        }
      }
    )(req, res, next);
  }
);
router.all('/logout', (req: $Request, res: $Response) => {
  req.logout();
  res.clearCookie('id_token', {});
  res.clearCookie('isAuthenticated', {});
  res.clearCookie('userType', {});
  const url = '/login';
  res.redirect(url);
});
router.post('/register',
  wrap(async (req: $Request, res: $Response) => {
    const existedUser = await models.User.findOne({ where: { name: req.body.name } });
    if (existedUser) {
      res.json({ err: '用户已经存在。' });
      return;
    }

    const newUser = models.User.build(
      _.assign({}, defaultUserOptions, req.body)
    );
    await newUser.setPassword(req.body.password);
    await newUser.save();
    res.json({ success: true, id: newUser.id });
  })
);

/**
 * Validate authentication and redirect if fail.
 */
router.use((req: $Request, res: $Response, next: NextFunction) => {
  if (req.user) {
    next(); // authenticated.
  } else if (req.method === 'OPTIONS') {
    next();
  } else if (nonAuthPaths.some((noAuthPath) => noAuthPath.test(req.path))) {
    next(); // no auth require.
  } else {
    redirectToLogin(req, res);
  }
});

router.post('/changePassword', wrap(async (req: $Request, res: $Response) => {
  const user = await models.User.findOne({
    where: Sequelize.where(
      Sequelize.fn('lower', Sequelize.col('name')),
      Sequelize.fn('lower', req.body.userName)
    )
  });
  if (!user) {
    res.json({ success: false });
    return;
  }
  if (!(await user.validPassword(req.body.originalPwd))) {
    res.json({ success: false });
    return;
  }
  await user.setPassword(req.body.newPwd);
  await user.save();
  res.json({ success: true, message: '修改成功' });
}));

export default { path: '/api', router };

