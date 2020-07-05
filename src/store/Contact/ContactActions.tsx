import {
  Contact,
  SET_ADDING,
  SET_ACTIVE,
  SET_EXISTING,
  CLEAR_CONTACTS,
  ContactActionTypes,
} from './ContactTypes';

export function setAdding(contact: Contact): ContactActionTypes {
  return {
    type: SET_ADDING,
    payload: contact,
  };
}

export function setActive(contact: Contact): ContactActionTypes {
  return {
    type: SET_ACTIVE,
    payload: contact,
  };
}

export function setExisting(contacts: Contact[]): ContactActionTypes {
  return {
    type: SET_EXISTING,
    payload: contacts,
  };
}

export function clearContacts(): ContactActionTypes {
  return {
    type: CLEAR_CONTACTS,
    payload: null,
  };
}
