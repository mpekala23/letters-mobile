import {
  SET_FACILITIES,
  SET_LOADED,
  FacilityActionTypes,
  FacilityState,
} from './FacilityTypes';

const initialState: FacilityState = {
  facilities: [],
  loaded: false,
};

export default function FacilityReducer(
  state = initialState,
  action: FacilityActionTypes
): FacilityState {
  const currentState = { ...state };
  switch (action.type) {
    case SET_FACILITIES:
      currentState.facilities = action.payload;
      return currentState;
    case SET_LOADED:
      currentState.loaded = action.payload;
      return currentState;
    default:
      return currentState;
  }
}
