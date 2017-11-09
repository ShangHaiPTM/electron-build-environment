// @flow
import { SHOW_MESSAGE } from './reducer';
import type { MessageState, ShowMessageAction } from './reducer';

export { SHOW_MESSAGE };
export type { MessageState };
export function showMessage(msg: MessageState): ShowMessageAction {
  return {
    type: SHOW_MESSAGE,
    message: msg
  };
}
