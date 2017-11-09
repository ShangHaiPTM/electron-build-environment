// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import authorize from '../features/auth/reducer';
import type {
  AuthAction,
  AuthState
} from '../features/auth/reducer';
import counter from './counter';
import loading from '../features/loading/reducer';
import type {
  LoadingAction,
  LoadingState
} from '../features/loading/reducer';
import messages from '../features/message/reducer';
import type {
  MessageAction,
  MessageState
} from '../features/message/reducer';
import loginPage from '../features/login-page/reducer';
import type {
  LoginPageAction,
  LoginPageState,
} from '../features/login-page/reducer';
import type { GeneralAction } from './general';

export default combineReducers({
  authorize,
  counter,
  loading,
  messages,
  loginPage,
  router,
});
export type ActionType = AuthAction |
  LoadingAction |
  MessageAction |
  LoginPageAction |
  GeneralAction
export type State = {
  authorize: AuthState,
  counter: *,
  loading: LoadingState,
  messages: MessageState,
  loginPage: LoginPageState,
  router: *,
}
