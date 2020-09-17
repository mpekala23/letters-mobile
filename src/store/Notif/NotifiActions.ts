import {
  Notif,
  ADD_NOTIF,
  HANDLE_NOTIF,
  SET_CURRENT_NOTIF,
  FutureNotif,
  SET_FUTURE_NOTIFS,
  NotifActionTypes,
} from './NotifTypes';

export function addNotif(notif: Notif): NotifActionTypes {
  return {
    type: ADD_NOTIF,
    payload: notif,
  };
}

export function handleNotif(): NotifActionTypes {
  return {
    type: HANDLE_NOTIF,
    payload: null,
  };
}

export function setCurrentNotif(notif: Notif): NotifActionTypes {
  return {
    type: SET_CURRENT_NOTIF,
    payload: notif,
  };
}

export function setFutureNotifs(futureNotifs: FutureNotif[]): NotifActionTypes {
  return {
    type: SET_FUTURE_NOTIFS,
    payload: futureNotifs,
  };
}
