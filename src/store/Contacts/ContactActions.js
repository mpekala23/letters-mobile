export const ADD_CONTACT = 'contacts/add_contact';

export const addContact = (data) => {
  return {
    type: ADD_CONTACT,
    payload: data,
  };
};
