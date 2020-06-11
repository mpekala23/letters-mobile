// TODO: make this typing better
// probably want a specific type for state abbrevs
export interface Facility {
  name: string;
  type: "Federal Prison" | "State Prison";
  address: string;
  city: string;
  state: string;
  postal: string;
}

export type NullableFacility = Facility | null;

export enum Storage {
  RememberToken = "Ameelio-Token",
}
