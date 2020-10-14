import { EntityTypes } from 'types';
import { AppState } from './types';

export const checkIfLoading = (
  store: AppState,
  ...actionsToCheck: EntityTypes[]
): boolean =>
  store.ui.loader.actions.some((entity) => actionsToCheck.includes(entity));

export const checkIfRefreshing = (
  store: AppState,
  actionToCheck: EntityTypes
): boolean =>
  store.ui.loader.refreshing.some((entity) => entity === actionToCheck);
