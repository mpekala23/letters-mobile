import { UserReferralsInfo } from 'types';
import {
  User,
  LOGIN_USER,
  LOGOUT_USER,
  SET_USER,
  UserActionTypes,
  AUTHENTICATE_USER,
  SET_USER_REFERRALS,
  SET_LOADING_STATUS,
} from './UserTypes';

export function authenticateUser(
  user: User,
  token: string,
  remember: string
): UserActionTypes {
  return {
    type: AUTHENTICATE_USER,
    payload: {
      user,
      token,
      remember,
    },
  };
}

export function loginUser(user: User): UserActionTypes {
  return {
    type: LOGIN_USER,
    payload: {
      user,
    },
  };
}

export function logoutUser(): UserActionTypes {
  return {
    type: LOGOUT_USER,
    payload: null,
  };
}

export function setUser(user: User): UserActionTypes {
  return {
    type: SET_USER,
    payload: user,
  };
}

export function setUserReferrals(
  userReferrals: UserReferralsInfo
): UserActionTypes {
  return {
    type: SET_USER_REFERRALS,
    payload: userReferrals,
  };
}

export function setLoadingStatus(loadingStatus: number): UserActionTypes {
  return {
    type: SET_LOADING_STATUS,
    payload: loadingStatus,
  };
}
