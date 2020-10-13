import { START_ACTION, STOP_ACTION, UIActionTypes } from './UITypes';

export const startAction = (name: string): UIActionTypes => ({
  type: START_ACTION,
  payload: {
    action: {
      name,
    },
  },
});

export const stopAction = (name: string): UIActionTypes => ({
  type: STOP_ACTION,
  payload: { name },
});
