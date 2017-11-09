// @flow
import type { GeneralAction } from '../../reducers/general';

export const SHOW_LOGIN = 'SHOW_LOGIN';
export const CLOSE_LOGIN = 'CLOSE_LOGIN';

export type LoginPageAction = {
  +type: typeof SHOW_LOGIN | typeof CLOSE_LOGIN
};

export type LoginPageState = {
  +shown: boolean,
};

export default function loginPage(
  state: LoginPageState = { shown: false },
  action: LoginPageAction | GeneralAction
) {
  switch (action.type) {
    case SHOW_LOGIN:
      return { shown: true };
    case CLOSE_LOGIN:
      return { shown: false };
    default:
      return state;
  }
}
