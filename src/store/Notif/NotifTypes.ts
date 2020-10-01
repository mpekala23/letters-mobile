import { Screens } from '@utils/Screens';

export const SET_UNRESPONDED_NOTIFS = 'notification/set_unresponded_notifs';
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
  Wildcard = 'Wildcard',
}

export interface Notif {
  title: string;
  body: string;
  type: NotifTypes;
  data?: {
    contactId?: number;
    letterId?: number;
    routes?: { name: Screens }[];
  };
}

export interface FutureNotif {
  id: string;
  time: string;
  notif: Notif;
}

// unrespondedNotifs are notifications that have been received but not tapped on
// futureNotifs are notifications that are yet to be received
export interface NotifState {
  unrespondedNotifs: Notif[];
  futureNotifs: FutureNotif[];
}

interface SetUnrespondedNotifsAction {
  type: typeof SET_UNRESPONDED_NOTIFS;
  payload: Notif[];
}

interface SetFutureNotifsAction {
  type: typeof SET_FUTURE_NOTIFS;
  payload: FutureNotif[];
}

export type NotifActionTypes =
  | SetUnrespondedNotifsAction
  | SetFutureNotifsAction;
