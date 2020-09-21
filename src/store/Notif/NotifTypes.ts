export const HANDLE_NOTIF = 'notification/handle_notif';
export const SET_CURRENT_NOTIF = 'notification/set_current_notif';
export const SET_FUTURE_NOTIFS = 'notification/set_future_notifs';

export enum NotifTypes {
  OnItsWay = 'OnItsWay',
  ProcessedForDelivery = 'ProcessedForDelivery',
  HasReceived = 'HasReceived',
  ReturnedToSender = 'ReturnedToSender',
  NoFirstContact = 'NoFirstContact',
  NoFirstLetter = 'NoFirstLetter',
  Drought = 'Drought',
  ReferralSignup = 'ReferralSignup',
  SpecialEvent = 'SpecialEvent',
}

export interface Notif {
  title: string;
  body: string;
  type: NotifTypes;
  data?: {
    contactId?: number;
    letterId?: number;
  };
}

export interface FutureNotif {
  id: string;
  time: string;
  notif: Notif;
}

// currentNotif is only not-null when there is a notification waiting to be dealt with
// pastNotifs includes the current notif, when it exists
export interface NotifState {
  currentNotif: Notif | null;
  futureNotifs: FutureNotif[];
}

interface SetCurrentNotifAction {
  type: 'notification/set_current_notif';
  payload: Notif | null;
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
  | SetCurrentNotifAction
  | HandleNotifAction
  | SetFutureNotifsAction;
