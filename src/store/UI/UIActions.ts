import { EntityTypes } from 'types';
import { START_ACTION, STOP_ACTION, UIActionTypes } from './UITypes';

export const startAction = (entity: EntityTypes): UIActionTypes => ({
  type: START_ACTION,
  payload: entity,
});

export const stopAction = (entity: EntityTypes): UIActionTypes => ({
  type: STOP_ACTION,
  payload: entity,
});
