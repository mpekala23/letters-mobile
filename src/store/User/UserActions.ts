import {
  User,
  LOGIN_USER,
  LOGOUT_USER,
  SET_USER,
  UserActionTypes,
} from './UserTypes';

/** Logs in a user, either by loaded token or successful auth. */
export function loginUser(user: User): UserActionTypes {
  return {
    type: LOGIN_USER,
    payload: user,
  };
}

/** Logs out a user  */
export function logoutUser(): UserActionTypes {
  return {
    type: LOGOUT_USER,
    payload: null,
  };
}

/** Updates user profile  */
export function setUser(user: User): UserActionTypes {
  return {
    type: SET_USER,
    payload: user,
  };
}
