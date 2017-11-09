// @flow

import { CLOSE_LOGIN, SHOW_LOGIN } from './reducer';

export function showLogin() {
  return { type: SHOW_LOGIN };
}
export function closeLogin() {
  return { type: CLOSE_LOGIN };
}
