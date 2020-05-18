import { combineReducers, createStore } from 'redux';
// import { connect } from 'react-redux';

const AppReducer = combineReducers({});

const RootReducer = (state, action) => {
  return AppReducer(state, action);
};

export const connectToStore = (component, name = '') => {
  switch (name) {
    default:
      return component;
  }
};

const store = createStore(RootReducer);

export default store;
