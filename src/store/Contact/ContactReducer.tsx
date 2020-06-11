import {
  ContactState,
  ContactActionTypes,
  SET_ADDING,
  SET_EXISTING,
  CLEAR_CONTACTS,
} from "./ContactTypes";

const initialState: ContactState = {
  adding: {
    state: "",
    firstName: "",
    lastName: "",
    inmateNumber: "",
    relationship: "",
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
    case CLEAR_CONTACTS:
      currentState.adding = {
        state: "",
        firstName: "",
        lastName: "",
        inmateNumber: "",
        relationship: "",
        facility: null,
      };
      currentState.existing = [];
      return currentState;
    default:
      return state;
  }
}
