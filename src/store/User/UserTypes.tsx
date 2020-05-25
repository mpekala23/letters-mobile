export const LOGIN_USER = "user/login_user";
export const LOGOUT_USER = "user/logout_user";

// state types

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  cell: string;
  address1: string;
  address2?: string;
  country: string;
  zipcode: string;
  city: string;
  state: string;
}

export interface AuthInfo {
  isLoadingToken: boolean;
  isLoggedIn: boolean;
  userToken?: string;
}

export interface UserState {
  authInfo: AuthInfo;
  user: User;
}

// action types

interface LoginUserAction {
  type: typeof LOGIN_USER;
  payload: User;
}

interface LogoutUserAction {
  type: typeof LOGOUT_USER;
  payload: null;
}

export type UserActionTypes = LoginUserAction | LogoutUserAction;
