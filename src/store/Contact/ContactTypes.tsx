import {
  ContactDraft,
  Contact,
  ContactPersonal,
  ContactFacility,
  ContactInmateInfo,
} from 'types';

export const SET_ADDING = 'contact/set_adding';
export const SET_ADDING_PERSONAL = 'contact/set_adding_personal';
export const SET_ADDING_FACILITY = 'contact/set_adding_facility';
export const SET_ADDING_INMATE_INFO = 'contact/set_adding_inmate_info';
export const SET_ACTIVE = 'contact/set_active';
export const SET_EXISTING = 'contact/set_existing';
export const UPDATE_CONTACT = 'contact/update_contact';
export const CLEAR_CONTACTS = 'contact/clear_contacts';

export interface ContactState {
  adding: ContactDraft;
  active: Contact;
  existing: Contact[];
}

interface SetAddingAction {
  type: typeof SET_ADDING;
  payload: ContactDraft;
}

interface SetAddingPersonalAction {
  type: typeof SET_ADDING_PERSONAL;
  payload: ContactPersonal;
}

interface SetAddingInmateInfoAction {
  type: typeof SET_ADDING_INMATE_INFO;
  payload: ContactInmateInfo;
}

interface SetAddingFacilityAction {
  type: typeof SET_ADDING_FACILITY;
  payload: ContactFacility;
}

interface SetActiveAction {
  type: typeof SET_ACTIVE;
  payload: Contact;
}

interface SetExistingAction {
  type: typeof SET_EXISTING;
  payload: Contact[];
}

interface UpdateContactAction {
  type: typeof UPDATE_CONTACT;
  payload: Contact;
}

interface ClearContactsAction {
  type: typeof CLEAR_CONTACTS;
  payload: null;
}

export type ContactActionTypes =
  | SetAddingAction
  | SetAddingPersonalAction
  | SetAddingFacilityAction
  | SetActiveAction
  | SetExistingAction
  | UpdateContactAction
  | ClearContactsAction
  | SetAddingInmateInfoAction;
