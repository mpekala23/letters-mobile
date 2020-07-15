import {
  ContactState,
  ContactActionTypes,
  SET_ADDING,
  SET_ACTIVE,
  SET_EXISTING,
  CLEAR_CONTACTS,
} from './ContactTypes';

const initialState: ContactState = {
  adding: {
    id: -1,
    firstName: '',
    lastName: '',
    inmateNumber: '',
    relationship: '',
    facility: null,
  },
  active: {
    id: -1,
    firstName: '',
    lastName: '',
    inmateNumber: '',
    relationship: '',
    facility: null,
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
    case SET_ACTIVE:
      currentState.active = action.payload;
      return currentState;
    case SET_EXISTING:
      currentState.existing = action.payload;
      return currentState;
    case CLEAR_CONTACTS:
      currentState.adding = initialState.adding;
      currentState.existing = [];
      return currentState;
    default:
      return state;
  }
}
