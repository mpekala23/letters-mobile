// TODO: make this typing better
// probably want a specific type for state abbrevs
export interface Facility {
  name: string;
  type: PrisonTypes;
  address: string;
  city: string;
  state: string;
  postal: string;
}

export enum ProfilePicTypes {
  Topbar = 'Topbar',
  Contact = 'Contact',
  SingleContact = 'SingleContact',
}

export type NullableFacility = Facility | null;

export enum Storage {
  RememberToken = 'Ameelio-Token',
}

export enum PrisonTypes {
  State = 'State',
  Federal = 'Federal',
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

export interface Letter {
  type: LetterTypes;
  status: LetterStatus;
  isDraft: boolean;
  recipientId: number;
  content: string;
  photo?: Photo;
  letterId?: number; // TODO: Once we have more info on this field and lob, use this more
  expectedDeliveryDate?: string;
  dateCreated?: string;
  trackingEvents?: LetterTrackingEvent[];
}

export interface LetterTrackingEvent {
  id: number;
  name: string;
  location: string;
  date: Date;
}

export type TopbarRouteAction = {
  enabled: boolean;
  text: string;
  action: () => void;
};

export interface ZipcodeInfo {
  zip: string;
  city: string;
  state: string;
}

export interface Photo {
  type?: 'image' | string;
  width?: number;
  height?: number;
  uri: string;
}
