import { Facility } from 'types';
import {
  SET_FACILITIES,
  SET_LOADED,
  FacilityActionTypes,
} from './FacilityTypes';

export function setFacilities(facilities: Facility[]): FacilityActionTypes {
  return {
    type: SET_FACILITIES,
    payload: facilities,
  };
}

export function setLoaded(loaded: boolean): FacilityActionTypes {
  return {
    type: SET_LOADED,
    payload: loaded,
  };
}
