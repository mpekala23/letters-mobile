import {
  NotifState,
  NotifActionTypes,
  SET_UNRESPONDED_NOTIFS,
  SET_FUTURE_NOTIFS,
} from './NotifTypes';

const initialState: NotifState = {
  unrespondedNotifs: [],
  futureNotifs: [],
};

export default function NotifReducer(
  state = initialState,
  action: NotifActionTypes
): NotifState {
  const currentState = { ...state };
  switch (action.type) {
    case SET_UNRESPONDED_NOTIFS:
      currentState.unrespondedNotifs = action.payload;
      return { ...currentState };
    case SET_FUTURE_NOTIFS:
      currentState.futureNotifs = action.payload;
      return currentState;
    default:
      return state;
  }
}
