import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import { AppState } from './types';
import ContactReducer from './Contact/ContactReducer';
import MailReducer from './Mail/MailReducer';
import NotifReducer from './Notif/NotifReducer';
import UserReducer from './User/UserReducer';

const config = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['user'],
  whitelist: ['contact', 'notif', 'mail'],
};

const combinedReducers = combineReducers<AppState>({
  user: UserReducer,
  contact: ContactReducer,
  notif: NotifReducer,
  mail: MailReducer,
});

const persistedReducers = persistReducer(config, combinedReducers);
const store = createStore(persistedReducers);

export const persistor = persistStore(store);
export default store;
