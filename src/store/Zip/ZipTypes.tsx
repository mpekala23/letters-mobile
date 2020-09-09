import { ZipcodeInfo } from 'types';

export const SET_ZIPCODES = 'zip/set_zipcodes';
export const SET_ZIPCODE = 'zip/set_zipcode';

export interface ZipState {
  zips: Record<string, ZipcodeInfo>;
}

interface SetZipcodesAction {
  type: typeof SET_ZIPCODES;
  payload: Record<string, ZipcodeInfo>;
}

interface SetZipcodeAction {
  type: typeof SET_ZIPCODE;
  payload: {
    zip: string;
    info: ZipcodeInfo;
  };
}

export type ZipActionTypes = SetZipcodesAction | SetZipcodeAction;
