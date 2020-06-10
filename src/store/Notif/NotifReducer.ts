import {
  NotifState,
  Notif,
  NotifActionTypes,
  ADD_NOTIF,
  HANDLE_NOTIF,
  SET_CURRENT_NOTIF,
  SET_ALL_NOTIFS,
} from "./NotifTypes";

const initialState: NotifState = {
  currentNotif: null,
  allNotifs: [],
};

export default function NotifReducer(
  state = initialState,
  action: NotifActionTypes
): NotifState {
  const currentState = { ...state };
  switch (action.type) {
    case ADD_NOTIF:
      currentState.currentNotif = action.payload;
      currentState.allNotifs.push(action.payload);
      return currentState;
    case HANDLE_NOTIF:
      currentState.currentNotif = null;
      return currentState;
    case SET_CURRENT_NOTIF:
      currentState.currentNotif = action.payload;
      return currentState;
    case SET_ALL_NOTIFS:
      currentState.allNotifs = action.payload;
      return currentState;
    default:
      return state;
  }
}
