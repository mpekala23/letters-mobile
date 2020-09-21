import {
  NotifState,
  NotifActionTypes,
  HANDLE_NOTIF,
  SET_CURRENT_NOTIF,
  SET_FUTURE_NOTIFS,
} from './NotifTypes';

const initialState: NotifState = {
  currentNotif: null,
  futureNotifs: [],
};

export default function NotifReducer(
  state = initialState,
  action: NotifActionTypes
): NotifState {
  const currentState = { ...state };
  switch (action.type) {
    case HANDLE_NOTIF:
      currentState.currentNotif = null;
      return currentState;
    case SET_CURRENT_NOTIF:
      currentState.currentNotif = action.payload;
      return currentState;
    case SET_FUTURE_NOTIFS:
      currentState.futureNotifs = action.payload;
      return currentState;
    default:
      return state;
  }
}
