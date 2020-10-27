import { EntityTypes, TopbarLeft, TopbarRight } from 'types';
import {
  START_ACTION,
  STOP_ACTION,
  SET_TOPBAR_RIGHT,
  SET_TOPBAR_LEFT,
  UIActionTypes,
} from './UITypes';

export const startAction = (entity: EntityTypes): UIActionTypes => ({
  type: START_ACTION,
  payload: entity,
});

export const stopAction = (entity: EntityTypes): UIActionTypes => ({
  type: STOP_ACTION,
  payload: entity,
});

export const setTopbarRight = (details: TopbarRight | null): UIActionTypes => ({
  type: SET_TOPBAR_RIGHT,
  payload: details,
});

export const setTopbarLeft = (details: TopbarLeft | null): UIActionTypes => ({
  type: SET_TOPBAR_LEFT,
  payload: details,
});
