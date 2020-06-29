// TODO: make this typing better
// probably want a specific type for state abbrevs
export interface Facility {
  name: string;
  type: 'Federal Prison' | 'State Prison';
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
  State = 'StatePrison',
  Federal = 'FederalPrison',
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
  PostCards = 'PostCards',
  Letters = 'Letters',
}

export interface Letter {
  type: LetterTypes;
  status: LetterStatus;
  isDraft: boolean;
  recipientId: number;
  message: string;
  photoPath?: string;
  letterId?: number; // TODO: Once we have more info on this field and lob, use this more
  expectedDeliveryDate?: string;
  trackingEvents?: LetterTrackingEvent[];
}

export interface LetterTrackingEvent {
  id: number;
  name: LetterStatus;
  location: string;
  date: string;
}
