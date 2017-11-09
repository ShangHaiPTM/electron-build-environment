// @flow
import type { Response } from 'whatwg-fetch';
import type { DispatchAPI } from 'redux';

import type { User } from '../../models/index';
import fetch from '../../utils/fetch/fetch.client';
import { AUTH_FAILED, AUTH_SUCCESS } from './reducer';
import type { AuthFailedAction, AuthSuccessAction } from './reducer';

export type LoginOptions = {
  +username: string,
  +password: string,
  +rememberMe: boolean,
}
export type LoginResult = {
  success: boolean,
  user?: User,
  err?: string,
}

const serverPath = process.env.SERVER_URL || 'http://localhost:3000';

export function login(options: LoginOptions, callback: (LoginResult) => void) {
  return (dispatch: DispatchAPI<AuthSuccessAction | AuthFailedAction>) => {
    fetch(`${serverPath}/api/login`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
      credentials: 'include'
    })
      .then((res: Response) => {
        if (!res.ok) {
          throw new Error(`网络错误: ${res.statusText}`);
        } else {
          return res.json();
        }
      })
      .then((json: LoginResult) => {
        if (json.success) {
          callback(json);
          return dispatch({ type: AUTH_SUCCESS, user: json.user });
        }
        throw new Error(json.err);
      })
      .catch((err: Error) => {
        callback({ success: false, err: err.message });
        return dispatch({ type: AUTH_FAILED, err });
      });
  };
}

export function logout(callback: (LoginResult)=>void) {
  return (dispatch: DispatchAPI<AuthFailedAction>) => {
    fetch(`${serverPath}/api/logout`, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include'
    })
      .then((res: Response) => {
        if (!res.ok) {
          throw new Error(`网络错误: ${res.statusText}`);
        } else {
          return res.json();
        }
      })
      .then((json: LoginResult) => {
        if (json.success) {
          callback(json);
          return dispatch({ type: AUTH_FAILED, err: new Error('成功登出！') });
        }
        throw new Error(JSON.stringify(json));
      })
      .catch((err: Error) => {
        callback({ success: false, err: err.message });
        return dispatch({ type: AUTH_FAILED, err });
      });
  };
}
