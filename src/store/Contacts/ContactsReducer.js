import * as ContactsActions from './ContactsActions';

const INITIAL_STATE = {
  contacts: [],
};

const ContactsReducer = (state = INITIAL_STATE, action) => {
  const newContacts = [...state.contacts];
  switch (action.type) {
    case ContactsActions.ADD_CONTACT:
      newContacts.push(action.payload.data);
      return { ...state, contacts: newContacts };
    default:
      return state;
  }
};

export default ContactsReducer;
