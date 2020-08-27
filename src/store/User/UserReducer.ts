import {
  UserState,
  UserActionTypes,
  LOGIN_USER,
  LOGOUT_USER,
  SET_USER,
  AUTHENTICATE_USER,
} from './UserTypes';

const initialState: UserState = {
  authInfo: {
    isLoadingToken: true,
    isLoggedIn: false,
    isLoaded: false,
    apiToken: '',
    rememberToken: '',
  },
  user: {
    id: -1,
    firstName: '',
    lastName: '',
    email: '',
    address1: '',
    address2: '',
    postal: '',
    city: '',
    state: '',
    credit: 0,
    joined: new Date(Date.now()),
  },
};

export default function UserReducer(
  state = initialState,
  action: UserActionTypes
): UserState {
  const currentState = { ...state };
  switch (action.type) {
    case AUTHENTICATE_USER:
      return {
        authInfo: {
          isLoadingToken: false,
          isLoggedIn: true,
          isLoaded: false,
          apiToken: action.payload.token,
          rememberToken: action.payload.remember,
        },
        user: action.payload.user,
      };
    case LOGIN_USER:
      return {
        authInfo: {
          ...currentState.authInfo,
          isLoadingToken: false,
          isLoggedIn: true,
          isLoaded: true,
        },
        user: action.payload.user,
      };
    case LOGOUT_USER:
      return {
        authInfo: {
          isLoadingToken: false,
          isLoggedIn: false,
          isLoaded: false,
          apiToken: '',
          rememberToken: '',
        },
        user: {
          id: -1,
          firstName: '',
          lastName: '',
          email: '',
          address1: '',
          address2: '',
          postal: '',
          city: '',
          state: '',
          credit: 0,
          joined: new Date(Date.now()),
        },
      };
    case SET_USER:
      currentState.user = action.payload;
      return currentState;
    default:
      return state;
  }
}
