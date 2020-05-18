import * as ContactActions from './ContactActions';

const INITIAL_STATE = {
  contacts: [],
};

const ContactReducer = (state = INITIAL_STATE, action) => {
  const newContacts = [...state.contacts];
  switch (action.type) {
    case ContactActions.ADD_CONTACT:
      newContacts.push(action.payload.data);
      return { ...state, contacts: newContacts };
    default:
      return state;
  }
};

export default ContactReducer;
