export const ADD_NOTIF = "notification/add_notif";
export const HANDLE_NOTIF = "notification/handle_notif";
export const SET_CURRENT_NOTIF = "notification/set_current_notif";
export const SET_ALL_NOTIFS = "notification/set_all_notifs";

export interface Notif {
  type: string;
  screen?: "FirstLetter";
  data?: object[];
}

// currentNotif is only not-null when there is a notification waiting to be dealt with
export interface NotifState {
  currentNotif: Notif | null;
  allNotifs: Notif[];
}

interface AddNotifAction {
  type: typeof ADD_NOTIF;
  payload: Notif;
}

interface HandleNotifAction {
  type: string;
  payload: null;
}

interface SetCurrentNotifAction {
  type: typeof SET_CURRENT_NOTIF;
  payload: Notif | null;
}

interface SetAllNotifsAction {
  type: typeof SET_ALL_NOTIFS;
  payload: Notif[];
}

export type NotifActionTypes =
  | AddNotifAction
  | SetCurrentNotifAction
  | SetAllNotifsAction
  | HandleNotifAction;
