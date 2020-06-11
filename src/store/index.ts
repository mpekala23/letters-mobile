import { combineReducers, createStore } from "redux";
import { AppState } from "./types";
import UserReducer from "./User/UserReducer";
import ContactReducer from "./Contact/ContactReducer";
import { persistStore, persistReducer } from "redux-persist";
import createSecureStore from "redux-persist-expo-securestore";

const storage = createSecureStore();

const config = {
  key: "root",
  storage,
};

const combinedReducers = combineReducers<AppState>({
  user: UserReducer,
  contact: ContactReducer,
});

const persistedReducers = persistReducer(config, combinedReducers);

const store = createStore(persistedReducers);
export const persistor = persistStore(store);

export default store;
