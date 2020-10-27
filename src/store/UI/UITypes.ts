import { EntityTypes, TopbarLeft, TopbarRight } from 'types';

export const START_ACTION = 'ui/start_action';
export const STOP_ACTION = 'ui/stop_action';
export const REFRESH_ACTION_START = 'ui/refresh_action_start';
export const REFRESH_ACTION_STOP = 'ui/refresh_action_stop';

export const SET_TOPBAR_RIGHT = 'ui/set_topbar_right';
export const SET_TOPBAR_LEFT = 'ui/set_topbar_left';

export interface UIState {
  loader: {
    actions: EntityTypes[];
  };
  topbarRight: TopbarRight | null;
  topbarLeft: TopbarLeft | null;
}

export interface StartAction {
  type: typeof START_ACTION;
  payload: EntityTypes;
}

export interface StopAction {
  type: typeof STOP_ACTION;
  payload: EntityTypes;
}

export interface SetTopbarRightAction {
  type: typeof SET_TOPBAR_RIGHT;
  payload: TopbarRight | null;
}

export interface SetTopbarLeftAction {
  type: typeof SET_TOPBAR_LEFT;
  payload: TopbarLeft | null;
}

export type UIActionTypes =
  | StartAction
  | StopAction
  | SetTopbarRightAction
  | SetTopbarLeftAction;
