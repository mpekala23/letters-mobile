import { combineReducers, createStore } from "redux";
import { AppState } from "./types";
import UserReducer from "./User/UserReducer";

export default createStore(
  combineReducers<AppState>({
    user: UserReducer,
  })
);
