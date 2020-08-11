import { Photo } from 'types';

export const AUTHENTICATE_USER = 'user/authenticate_user';
export const LOGIN_USER = 'user/login_user';
export const LOGOUT_USER = 'user/logout_user';
export const SET_USER = 'user/set_user';

// state types
export interface UserRegisterInfo {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  address1: string;
  address2?: string;
  postal: string;
  city: string;
  state: string;
  referer: string;
  imageUri?: string;
  remember?: boolean;
  photo?: Photo;
}

export interface UserLoginInfo {
  email: string;
  password: string;
  remember?: boolean;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  address2?: string;
  postal: string;
  city: string;
  state: string;
  photo?: Photo;
  credit: number;
  joined: Date;
}

export interface AuthInfo {
  isLoadingToken: boolean;
  isLoggedIn: boolean;
  isLoaded: boolean;
  apiToken: string;
  rememberToken: string;
}

export interface UserState {
  authInfo: AuthInfo;
  user: User;
}

interface AuthenticateUserAction {
  type: typeof AUTHENTICATE_USER;
  payload: {
    user: User;
    token: string;
    remember: string;
  };
}

interface LoginUserAction {
  type: typeof LOGIN_USER;
  payload: {
    user: User;
  };
}

interface LogoutUserAction {
  type: typeof LOGOUT_USER;
  payload: null;
}

interface SetUserAction {
  type: typeof SET_USER;
  payload: User;
}

export type UserActionTypes =
  | AuthenticateUserAction
  | LoginUserAction
  | LogoutUserAction
  | SetUserAction;
