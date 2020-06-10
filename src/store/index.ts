import { combineReducers, createStore } from "redux";
import { AppState } from "./types";
import UserReducer from "./User/UserReducer";
import NotifReducer from "./Notif/NotifReducer";

export default createStore(
  combineReducers<AppState>({
    user: UserReducer,
    notif: NotifReducer,
  })
);
