import {
  SET_ZIPCODES,
  SET_ZIPCODE,
  ZipActionTypes,
  ZipState,
} from './ZipTypes';

const initialState: ZipState = {
  zips: {},
};

export default function ZipReducer(
  state = initialState,
  action: ZipActionTypes
): ZipState {
  const currentState = { ...state };
  switch (action.type) {
    case SET_ZIPCODES:
      currentState.zips = action.payload;
      return currentState;
    case SET_ZIPCODE:
      currentState.zips[action.payload.zip] = action.payload.info;
      return currentState;
    default:
      return currentState;
  }
}
