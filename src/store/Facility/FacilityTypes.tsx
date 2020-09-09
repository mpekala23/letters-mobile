import { Facility } from 'types';

export const SET_FACILITIES = 'facility/set_facilities';
export const SET_LOADED = 'facility/set_loaded';

export interface FacilityState {
  facilities: Facility[];
  loaded: boolean;
}

interface SetFacilitiesAction {
  type: typeof SET_FACILITIES;
  payload: Facility[];
}

interface SetLoadedAction {
  type: typeof SET_LOADED;
  payload: boolean;
}

export type FacilityActionTypes = SetFacilitiesAction | SetLoadedAction;
