import { PrisonTypes, Contact } from 'types';
import {
  ContactState,
  ContactActionTypes,
  SET_ADDING,
  SET_ADDING_PERSONAL,
  SET_ADDING_FACILITY,
  SET_ADDING_INMATE_INFO,
  SET_ACTIVE,
  SET_EXISTING,
  UPDATE_CONTACT,
  CLEAR_CONTACTS,
} from './ContactTypes';

const initialState: ContactState = {
  adding: {
    firstName: '',
    lastName: '',
    inmateNumber: '',
    relationship: '',
    facility: {
      name: '',
      type: PrisonTypes.State,
      address: '',
      city: '',
      state: '',
      postal: '',
      phone: '',
    },
  },
  active: {
    id: -1,
    firstName: '',
    lastName: '',
    inmateNumber: '',
    relationship: '',
    facility: {
      name: '',
      type: PrisonTypes.State,
      address: '',
      city: '',
      state: '',
      postal: '',
      phone: '',
    },
    backgroundColor: '',
    totalSent: 0,
    mailPage: 1,
    hasNextPage: false,
  },
  existing: [],
};

export default function ContactReducer(
  state = initialState,
  action: ContactActionTypes
): ContactState {
  const currentState = { ...state };
  let ix = -1;
  switch (action.type) {
    case SET_ADDING:
      currentState.adding = action.payload;
      return currentState;
    case SET_ADDING_PERSONAL:
      currentState.adding = { ...currentState.adding, ...action.payload };
      return currentState;
    case SET_ADDING_FACILITY:
      currentState.adding = { ...currentState.adding, ...action.payload };
      return currentState;
    case SET_ADDING_INMATE_INFO:
      currentState.adding = { ...currentState.adding, ...action.payload };
      return currentState;
    case SET_ACTIVE:
      currentState.active = action.payload;
      return currentState;
    case SET_EXISTING:
      currentState.existing = action.payload;
      return currentState;
    case UPDATE_CONTACT:
      ix = currentState.existing.findIndex(
        (contact: Contact) => contact.id === action.payload.id
      );
      if (ix >= 0) {
        currentState.existing[ix] = action.payload;
      }
      return currentState;
    case CLEAR_CONTACTS:
      currentState.adding = initialState.adding;
      currentState.existing = [];
      return currentState;
    default:
      return state;
  }
}
