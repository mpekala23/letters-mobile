import { PrisonTypes } from 'types';
import {
  ContactState,
  ContactActionTypes,
  SET_ADDING,
  SET_ADDING_PERSONAL,
  SET_ADDING_FACILITY,
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
  },
  existing: [],
};

export default function ContactReducer(
  state = initialState,
  action: ContactActionTypes
): ContactState {
  const currentState = { ...state };
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
    case SET_ACTIVE:
      currentState.active = action.payload;
      return currentState;
    case SET_EXISTING:
      currentState.existing = action.payload;
      return currentState;
    case UPDATE_CONTACT:
      for (let ix = 0; ix < currentState.existing.length; ix += 1) {
        if (currentState.existing[ix].id === action.payload.id) {
          currentState.existing[ix] = action.payload;
        }
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
