import { combineReducers, createStore } from 'redux';
// import { connect } from 'react-redux';
import ContactsReducer from './Contacts/ContactsReducer';

const AppReducer = combineReducers({
  contacts: ContactsReducer,
});

const RootReducer = (state, action) => {
  return AppReducer(state, action);
};

/**
 * A function to connect a react component to certain store changes.
 * @param {object} component - A react component that you would like to receive store items as props
 * @param {string} name - The name of the reducer to connect to.
 */
export const connectToStore = (component, name = '') => {
  switch (name) {
    default:
      return component;
  }
};

const store = createStore(RootReducer);

export default store;
