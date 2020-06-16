import { ContactState, ContactActionTypes, SET_ADDING, SET_EXISTING } from './ContactTypes';

const initialState: ContactState = {
  adding: {
    state: '',
    first_name: '',
    last_name: '',
    inmate_number: '',
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
    case SET_EXISTING:
      currentState.existing = action.payload;
      return currentState;
    default:
      return state;
  }
}
