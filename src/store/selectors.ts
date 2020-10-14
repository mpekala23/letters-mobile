/* eslint-disable import/prefer-default-export */
import { EntityTypes } from 'types';
import { AppState } from './types';

export const checkIfLoading = (
  store: AppState,
  ...actionsToCheck: EntityTypes[]
): boolean =>
  store.ui.loader.actions.some((entity) => actionsToCheck.includes(entity));
