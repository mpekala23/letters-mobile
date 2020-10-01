import { UserReferralsInfo } from 'types';
import {
  User,
  LOGIN_USER,
  LOGOUT_USER,
  SET_USER,
  UserActionTypes,
  AUTHENTICATE_USER,
  SET_USER_REFERRALS,
} from './UserTypes';

/** Authenticates a user */
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

/** Logs in a user, meaning they are authenitcated and loaded */
export function loginUser(user: User): UserActionTypes {
  return {
    type: LOGIN_USER,
    payload: {
      user,
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

/** Updates user profile  */
export function setUser(user: User): UserActionTypes {
  return {
    type: SET_USER,
    payload: user,
  };
}

/** Updates user referral  */
export function setUserReferrals(
  userReferrals: UserReferralsInfo
): UserActionTypes {
  return {
    type: SET_USER_REFERRALS,
    payload: userReferrals,
  };
}
