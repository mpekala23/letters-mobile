import { Image, UserReferralsInfo } from 'types';

export const AUTHENTICATE_USER = 'user/authenticate_user';
export const LOGIN_USER = 'user/login_user';
export const LOGOUT_USER = 'user/logout_user';
export const SET_USER = 'user/set_user';
export const SET_USER_REFERRALS = 'user/set_user_referrals';

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
  phyState: string;
  referrer: string;
  remember?: boolean;
  image?: Image;
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
  photo?: Image;
  credit: number;
  joined: Date;
  referralCode: string;
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
  userReferrals: UserReferralsInfo;
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

interface SetUserAction {
  type: typeof SET_USER;
  payload: User;
}

interface SetUserReferralsAction {
  type: typeof SET_USER_REFERRALS;
  payload: UserReferralsInfo;
}

export type UserActionTypes =
  | AuthenticateUserAction
  | LoginUserAction
  | LogoutUserAction
  | SetUserAction
  | SetUserReferralsAction;
