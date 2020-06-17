import { combineReducers, createStore } from 'redux';
import { AppState } from './types';
import UserReducer from './User/UserReducer';
import NotifReducer from './Notif/NotifReducer';
import ContactReducer from './Contact/ContactReducer';

export default createStore(
  combineReducers<AppState>({
    user: UserReducer,
    notif: NotifReducer,
    contact: ContactReducer,
  })
);
