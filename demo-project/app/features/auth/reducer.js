// @flow
import type { User } from '../../models/index';
import type { GeneralAction } from '../../reducers/general';

export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const AUTH_FAILED = 'AUTH_FAILED';

export type AuthSuccessAction = {
  +type: typeof AUTH_SUCCESS,
  +user: User,
}
export type AuthFailedAction = {
  +type: typeof AUTH_FAILED,
  +err: Error,
}
export type AuthState = {
  +authorized: boolean,
  +user?: User,
  +err?: Error,
}

export type AuthAction = AuthSuccessAction | AuthFailedAction;

const initState = {
  authorized: false,
};

export default function authorized(
  state: AuthState = initState,
  action: AuthAction | GeneralAction,
): AuthState {
  switch (action.type) {
    case AUTH_SUCCESS:
      return {
        authorized: true,
        user: { ...action.user },
      };
    case AUTH_FAILED:
      return {
        authorized: false,
        err: action.err,
      };
    default:
      return state;
  }
}
