import {
  NotifState,
  Notif,
  NotifActionTypes,
  ADD_NOTIF,
  HANDLE_NOTIF,
  SET_CURRENT_NOTIF,
  SET_PAST_NOTIFS,
  SET_FUTURE_NOTIFS,
} from './NotifTypes';

const initialState: NotifState = {
  currentNotif: null,
  pastNotifs: [],
  futureNotifs: [],
};

export default function NotifReducer(
  state = initialState,
  action: NotifActionTypes
): NotifState {
  const currentState = { ...state };
  switch (action.type) {
    case ADD_NOTIF:
      currentState.currentNotif = action.payload;
      currentState.pastNotifs.push(action.payload);
      return currentState;
    case HANDLE_NOTIF:
      currentState.currentNotif = null;
      return currentState;
    case SET_CURRENT_NOTIF:
      currentState.currentNotif = action.payload;
      return currentState;
    case SET_PAST_NOTIFS:
      currentState.pastNotifs = action.payload;
      return currentState;
    case SET_FUTURE_NOTIFS:
      currentState.futureNotifs = action.payload;
      return currentState;
    default:
      return state;
  }
}
