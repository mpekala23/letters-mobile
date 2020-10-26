import {
  Contact,
  ContactDraft,
  ContactPersonal,
  ContactFacility,
  ContactInmateInfo,
} from 'types';
import {
  SET_ADDING,
  SET_ADDING_PERSONAL,
  SET_ADDING_FACILITY,
  SET_ACTIVE,
  SET_ACTIVE_BY_ID,
  SET_EXISTING,
  UPDATE_CONTACT,
  CLEAR_CONTACTS,
  SET_ADDING_INMATE_INFO,
  ContactActionTypes,
} from './ContactTypes';

export function setAdding(contact: ContactDraft): ContactActionTypes {
  return {
    type: SET_ADDING,
    payload: contact,
  };
}

export function setAddingPersonal(
  contactPersonal: ContactPersonal
): ContactActionTypes {
  return {
    type: SET_ADDING_PERSONAL,
    payload: contactPersonal,
  };
}

export function setAddingFacility(
  contactFacility: ContactFacility
): ContactActionTypes {
  return {
    type: SET_ADDING_FACILITY,
    payload: contactFacility,
  };
}

export function setAddingInmateInfo(
  contactInmateInfo: ContactInmateInfo
): ContactActionTypes {
  return {
    type: SET_ADDING_INMATE_INFO,
    payload: contactInmateInfo,
  };
}

export function setActive(contact: Contact): ContactActionTypes {
  return {
    type: SET_ACTIVE,
    payload: contact,
  };
}

export function setActiveById(id: number): ContactActionTypes {
  return {
    type: SET_ACTIVE_BY_ID,
    payload: id,
  };
}

export function setExisting(contacts: Contact[]): ContactActionTypes {
  return {
    type: SET_EXISTING,
    payload: contacts,
  };
}

export function updateContact(contact: Contact): ContactActionTypes {
  return {
    type: UPDATE_CONTACT,
    payload: contact,
  };
}

export function clearContacts(): ContactActionTypes {
  return {
    type: CLEAR_CONTACTS,
    payload: null,
  };
}
