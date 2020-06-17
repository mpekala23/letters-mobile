import { ReactText } from 'react';

export const ADD_NOTIF = 'notification/add_notif';
export const HANDLE_NOTIF = 'notification/handle_notif';
export const SET_CURRENT_NOTIF = 'notification/set_current_notif';
export const SET_PAST_NOTIFS = 'notification/set_past_notifs';
export const SET_FUTURE_NOTIFS = 'notification/set_future_notifs';

export enum NotifType {
  FirstLetter = 'FirstLetter',
}

// what is necessary to communicate with the notification API
// necessary to keep separately because we cannot retrive title and body once it's processed
export interface NativeNotif {
  title: string;
  body: string;
  data: Notif;
}

export interface Notif {
  type: NotifType;
  screen?: 'FirstLetter' | 'Home';
  data?: Record<string, unknown>[];
}

export interface FutureNotif {
  id: ReactText;
  time: number;
  nativeNotif: NativeNotif;
}

// currentNotif is only not-null when there is a notification waiting to be dealt with
// pastNotifs includes the current notif, when it exists
export interface NotifState {
  currentNotif: Notif | null;
  pastNotifs: Notif[];
  futureNotifs: FutureNotif[];
}

interface AddNotifAction {
  type: 'notification/add_notif';
  payload: Notif;
}

interface SetCurrentNotifAction {
  type: 'notification/set_current_notif';
  payload: Notif | null;
}

interface SetPastNotifsAction {
  type: 'notification/set_past_notifs';
  payload: Notif[];
}

interface SetFutureNotifsAction {
  type: 'notification/set_future_notifs';
  payload: FutureNotif[];
}

interface HandleNotifAction {
  type: 'notification/handle_notif';
  payload: null;
}

export type NotifActionTypes =
  | AddNotifAction
  | SetCurrentNotifAction
  | SetPastNotifsAction
  | HandleNotifAction
  | SetFutureNotifsAction;
