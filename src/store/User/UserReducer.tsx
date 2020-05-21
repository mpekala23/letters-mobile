import {
  UserState,
  UserActionTypes,
  LOGIN_USER,
  LOGOUT_USER,
} from "./UserTypes";

const initialState: UserState = {
  authInfo: {
    isLoadingToken: true,
    isLoggedIn: false,
    userToken: "",
  },
  user: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    cell: "",
    address1: "",
    address2: "",
    country: "",
    zipcode: "",
    city: "",
    state: "",
  },
};

export default function UserReducer(
  state = initialState,
  action: UserActionTypes
): UserState {
  switch (action.type) {
    case LOGIN_USER:
      return {
        authInfo: {
          isLoadingToken: false,
          isLoggedIn: true,
          userToken: "create token here",
        },
        user: action.payload,
      };
    case LOGOUT_USER:
      return {
        authInfo: {
          isLoadingToken: false,
          isLoggedIn: false,
          userToken: "",
        },
        user: {
          id: "",
          firstName: "",
          lastName: "",
          email: "",
          cell: "",
          address1: "",
          address2: "",
          country: "",
          zipcode: "",
          city: "",
          state: "",
        },
      };
    default:
      return state;
  }
}
