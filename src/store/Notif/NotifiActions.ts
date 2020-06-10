import {
  Notif,
  ADD_NOTIF,
  HANDLE_NOTIF,
  SET_CURRENT_NOTIF,
  SET_PAST_NOTIFS,
  FutureNotif,
  SET_FUTURE_NOTIFS,
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

export function setPastNotifs(notifs: Notif[]) {
  return {
    type: SET_PAST_NOTIFS,
    payload: notifs,
  };
}

export function setFutureNotifs(futureNotifs: FutureNotif[]) {
  return {
    type: SET_FUTURE_NOTIFS,
    payload: futureNotifs,
  };
}
