// @flow

import type { GeneralAction } from '../../reducers/general';

export const SHOW_MESSAGE = 'SHOW_MESSAGE';
export type MessageState = {
  message: string,
  action?: string,
  onActionTouchTap?: (event: any) => void,
  timestamp?: Date,
};

export type ShowMessageAction = {
  +type: typeof SHOW_MESSAGE,
  +message: MessageState,
};

export type MessageAction = ShowMessageAction;

const initState: MessageState = {
  message: ''
};

export default function messages(
  state: MessageState = initState,
  action: MessageAction | GeneralAction
): MessageState {
  if (action.type === SHOW_MESSAGE) {
    return {
      ...action.message,
      timestamp: new Date()
    };
  }
  return state;
}
