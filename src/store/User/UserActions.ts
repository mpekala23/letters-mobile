import { User, LOGIN_USER, LOGOUT_USER, UserActionTypes } from './UserTypes';

/** Logs in a user, either by loaded token or successful auth. */
export function loginUser(
  user: User,
  token: string,
  remember: string
): UserActionTypes {
  return {
    type: LOGIN_USER,
    payload: {
      user,
      token,
      remember,
    },
  };
}

/** Logs out a user  */
export function logoutUser(): UserActionTypes {
  return {
    type: LOGOUT_USER,
    payload: null,
  };
}
