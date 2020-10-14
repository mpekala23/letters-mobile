import { EntityTypes } from 'types';

export const START_ACTION = 'ui/start_action';
export const STOP_ACTION = 'ui/stop_action';
export const REFRESH_ACTION_START = 'ui/refresh_action_start';
export const REFRESH_ACTION_STOP = 'ui/refresh_action_stop';

export interface UIState {
  loader: {
    actions: EntityTypes[];
    refreshing: EntityTypes[];
  };
}

export interface StartAction {
  type: typeof START_ACTION;
  payload: EntityTypes;
}

export interface StopAction {
  type: typeof STOP_ACTION;
  payload: EntityTypes;
}

export type UIActionTypes = StartAction | StopAction;
