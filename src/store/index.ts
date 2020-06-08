import { combineReducers, createStore } from "redux";
import { AppState } from "./types";
import UserReducer from "./User/UserReducer";
import ContactReducer from "./Contact/ContactReducer";

export default createStore(
  combineReducers<AppState>({
    user: UserReducer,
    contact: ContactReducer,
  })
);
