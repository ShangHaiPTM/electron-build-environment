// @flow
import type { GeneralAction } from '../../reducers/general';

export const SHOW_LOADING = 'SHOW_LOADING';
export const HIDE_LOADING = 'HIDE_LOADING';

export type LoadingState = {
  shown: boolean
}
export type LoadingAction = {
  type: string
}
export default function loading(
  state: LoadingState = { shown: false },
  action: LoadingAction | GeneralAction
): LoadingState {
  switch (action.type) {
    case SHOW_LOADING:
      return {
        shown: true
      };
    case HIDE_LOADING:
      return {
        shown: false
      };
    default :
      return state;
  }
}
