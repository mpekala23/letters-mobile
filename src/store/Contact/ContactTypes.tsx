import { Facility, Photo } from 'types';

export const SET_ADDING = 'contact/set_adding';
export const SET_ACTIVE = 'contact/set_active';
export const SET_EXISTING = 'contact/set_existing';
export const CLEAR_CONTACTS = 'contact/clear_contacts';

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  inmateNumber: string;
  relationship: string;
  facility: Facility | null;
  credit: number;
  dorm?: string;
  unit?: string;
  photo?: Photo;
}

export interface ContactState {
  adding: Contact;
  active: Contact;
  existing: Contact[];
}

interface SetAddingAction {
  type: typeof SET_ADDING;
  payload: Contact;
}

interface SetActiveAction {
  type: typeof SET_ACTIVE;
  payload: Contact;
}

interface SetExistingAction {
  type: typeof SET_EXISTING;
  payload: Contact[];
}

interface ClearContactsAction {
  type: typeof CLEAR_CONTACTS;
  payload: null;
}

export type ContactActionTypes =
  | SetAddingAction
  | SetActiveAction
  | SetExistingAction
  | ClearContactsAction;
