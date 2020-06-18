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

export enum DeliveryProgress {
  Created = '0%',
  Printed = '25%',
  Mailed = '50%',
  OutForDelivery = '75%',
  Delivered = '100%',
}
