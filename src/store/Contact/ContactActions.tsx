import {
  Contact,
  SET_ADDING,
  SET_EXISTING,
  ContactActionTypes,
} from './ContactTypes';

export function setAdding(contact: Contact): ContactActionTypes {
  return {
    type: SET_ADDING,
    payload: contact,
  };
}

export function setExisting(contacts: Contact[]): ContactActionTypes {
  return {
    type: SET_EXISTING,
    payload: contacts,
  };
}
