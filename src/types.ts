// TODO: make this typing better
// probably want a specific type for state abbrevs
export interface Facility {
  name: string;
  type: PrisonTypes;
  address: string;
  city: string;
  state: string;
  postal: string;
  phone: string;
}

export enum ProfilePicTypes {
  Topbar = 'Topbar',
  Contact = 'Contact',
  SingleContact = 'SingleContact',
}

export enum Storage {
  RememberToken = 'Ameelio-Token',
}

export enum PrisonTypes {
  State = 'State',
  Federal = 'Federal',
  Jail = 'County',
}

export enum SupportFAQTypes {
  DeleteLetter = 'DeleteLetter',
  NotArrived = 'NotArrived',
  WrongReturnAddress = 'WrongReturnAddress',
  WrongMailingAddress = 'WrongMailingAddress',
  TrackingNumber = 'TrackingNumber',
  TrackingError = 'TrackingError',
  TalkToAmeelio = 'TalkToAmeelio',
}

export enum LetterStatus {
  Draft = 'Draft',
  Created = 'Created',
  Mailed = 'Mailed',
  InTransit = 'In Transit',
  InLocalArea = 'In Local Area',
  OutForDelivery = 'Out for Delivery',
  Delivered = 'Delivered',
}

export enum LetterTypes {
  Postcard = 'postcard',
  Letter = 'letter',
}

export enum DeliveryReportTypes {
  received = 'received',
  unsure = 'unsure',
  notYetReceived = 'notYetReceived',
  haveNotAsked = 'haveNotAsked',
  haveNotReceived = 'haveNotReceived',
}

export interface Letter {
  type: LetterTypes;
  status: LetterStatus;
  isDraft: boolean;
  recipientId: number;
  content: string;
  photo?: Photo;
  letterId?: number; // TODO: Once we have more info on this field and lob, use this more
  expectedDeliveryDate?: Date;
  dateCreated?: Date;
  trackingEvents?: LetterTrackingEvent[];
}

export interface LetterTrackingEvent {
  id: number;
  name: string;
  location: ZipcodeInfo;
  date: Date;
}

export type TopbarRouteAction = {
  enabled: boolean;
  text: string;
  action: () => void | Promise<void>;
  blocking?: boolean;
};

export interface ZipcodeInfo {
  zip: string;
  city: string;
  state: string;
  lat?: number;
  long?: number;
}

export interface Photo {
  type?: 'image' | string;
  width?: number;
  height?: number;
  uri: string;
}
