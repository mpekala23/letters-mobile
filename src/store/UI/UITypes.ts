export const START_ACTION = 'ui/start_action';
export const STOP_ACTION = 'ui/stop_action';

export interface UIState {
  loader: {
    actions: string[];
  };
}

export interface StartAction {
  type: typeof START_ACTION;
  payload: {
    action: { name: string };
  };
}

export interface StopAction {
  type: typeof STOP_ACTION;
  payload: { name: string };
}

export type UIActionTypes = StartAction | StopAction;
