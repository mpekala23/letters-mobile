import {
  ContactState,
  ContactActionTypes,
  SET_ADDING,
  SET_EXISTING,
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
  switch (action.type) {
    case SET_ADDING:
      return state;
    case SET_EXISTING:
      return state;
    default:
      return state;
  }
}
