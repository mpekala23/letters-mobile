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
  TopbarProfile = 'TopbarProfile',
  ContactProfile = 'ContactProfile',
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
  Draft = '0%',
  Created = '20%',
  Printed = '40%',
  Mailed = '60%',
  OutForDelivery = '80%',
  Delivered = '100%',
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
}
