import { Facility } from "types";

export const SET_ADDING = "contact/set_adding";
export const SET_EXISTING = "contact/set_existing";
export const CLEAR_CONTACTS = "contact/clear_contacts";

export interface Contact {
  id: number;
  state: string;
  firstName: string;
  lastName: string;
  inmateNumber: string;
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

interface ClearContactsAction {
  type: typeof CLEAR_CONTACTS;
  payload: null;
}

export type ContactActionTypes =
  | SetAddingAction
  | SetExistingAction
  | ClearContactsAction;
