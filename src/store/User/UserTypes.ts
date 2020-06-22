export const LOGIN_USER = 'user/login_user';
export const LOGOUT_USER = 'user/logout_user';

// state types
export interface UserRegisterInfo {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  address1: string;
  address2?: string;
  country: string;
  postal: string;
  city: string;
  state: string;
  imageUri?: string;
  remember?: boolean;
}

export interface UserLoginInfo {
  email: string;
  password: string;
  remember?: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address1: string;
  address2?: string;
  country: string;
  postal: string;
  city: string;
  state: string;
  imageUri?: string;
}

export interface AuthInfo {
  isLoadingToken: boolean;
  isLoggedIn: boolean;
  apiToken: string;
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
