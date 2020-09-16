import { combineReducers, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import { AppState } from './types';
import CategoryReducer from './Category/CategoryReducer';
import ContactReducer from './Contact/ContactReducer';
import FacilityReducer from './Facility/FacilityReducer';
import MailReducer from './Mail/MailReducer';
import NotifReducer from './Notif/NotifReducer';
import UserReducer from './User/UserReducer';
import ZipReducer from './Zip/ZipReducer';

const config = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: ['user', 'facility'],
  whitelist: ['category', 'contact', 'notif', 'mail', 'zip'],
};

const combinedReducers = combineReducers<AppState>({
  user: UserReducer,
  category: CategoryReducer,
  contact: ContactReducer,
  facility: FacilityReducer,
  mail: MailReducer,
  notif: NotifReducer,
  zip: ZipReducer,
});

const persistedReducers = persistReducer(config, combinedReducers);
const store = createStore(persistedReducers);

export const persistor = persistStore(store);
export default store;
