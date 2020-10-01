import {
  Notif,
  SET_UNRESPONDED_NOTIFS,
  FutureNotif,
  SET_FUTURE_NOTIFS,
  NotifActionTypes,
} from './NotifTypes';

export function setUnrespondedNotifs(notifs: Notif[]): NotifActionTypes {
  return {
    type: SET_UNRESPONDED_NOTIFS,
    payload: notifs,
  };
}

export function setFutureNotifs(futureNotifs: FutureNotif[]): NotifActionTypes {
  return {
    type: SET_FUTURE_NOTIFS,
    payload: futureNotifs,
  };
}
