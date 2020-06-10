import {
  Notif,
  ADD_NOTIF,
  HANDLE_NOTIF,
  SET_CURRENT_NOTIF,
  SET_ALL_NOTIFS,
} from "./NotifTypes";

export function addNotif(notif: Notif) {
  return {
    type: ADD_NOTIF,
    payload: notif,
  };
}

export function handleNotif() {
  return {
    type: HANDLE_NOTIF,
    payload: null,
  };
}

export function setCurrentNotif(notif: Notif) {
  return {
    type: SET_CURRENT_NOTIF,
    payload: notif,
  };
}

export function setAllNotifs(notifs: Notif[]) {
  return {
    type: SET_ALL_NOTIFS,
    payload: notifs,
  };
}
