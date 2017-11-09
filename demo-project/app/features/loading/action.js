/**
 * Created by chenxu on 16-12-13.
 */
import { SHOW_LOADING, HIDE_LOADING } from './reducer';

export function showLoading() {
  return {
    type: SHOW_LOADING,
    payload: true,
  };
}

export function hideLoading() {
  return {
    type: HIDE_LOADING,
    payload: false,
  };
}
