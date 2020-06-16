import { Facility } from 'types';

export const SET_ADDING = 'contact/set_adding';
export const SET_EXISTING = 'contact/set_existing';

export interface Contact {
  state: string;
  first_name: string;
  last_name: string;
  inmate_number: string;
  relationship: string;
  facility: Facility | null;
}

export interface ContactState {
  adding: Contact;
  existing: Contact[];
}

interface SetAddingAction {
  type: typeof SET_ADDING;
  payload: Contact;
}

interface SetExistingAction {
  type: typeof SET_EXISTING;
  payload: Contact[];
}

export type ContactActionTypes = SetAddingAction | SetExistingAction;
