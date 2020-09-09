import { ZipcodeInfo } from 'types';
import { SET_ZIPCODES, SET_ZIPCODE, ZipActionTypes } from './ZipTypes';

export function setZipcodes(
  zipcodes: Record<string, ZipcodeInfo>
): ZipActionTypes {
  return {
    type: SET_ZIPCODES,
    payload: zipcodes,
  };
}

export function setZipcode(zip: string, info: ZipcodeInfo): ZipActionTypes {
  return {
    type: SET_ZIPCODE,
    payload: {
      zip,
      info,
    },
  };
}
