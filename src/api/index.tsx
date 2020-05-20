import store from "@store";
import { loginUser, logoutUser } from "@store/User/UserActions";
import { User } from "@store/User/UserTypes";
import url from "url";

export const API_URL = "http://localhost::somethinglater";

url.resolve(API_URL, "fill later");

/** Dummy function atm, once I implement persistent storage I will replace. */
export function loadToken() {
  const dummyData: User = {
    id: "1",
    firstName: "Evan",
    lastName: "Legrand",
    email: "eleg@college",
    cell: "6127038623",
    address1: "place",
    address2: "",
    country: "USA",
    zipcode: "55419",
    city: "Minneapolis",
    state: "Minnesota",
  };
  setTimeout(() => {
    if (Math.random() >= 0.5) {
      store.dispatch(loginUser(dummyData));
    } else {
      store.dispatch(logoutUser());
    }
  }, 2000);
}

/** Dummy function atm, once I implement mock login API calls (and then real calls) I will replace */
export function login() {
  const dummyData: User = {
    id: "1",
    firstName: "Evan",
    lastName: "Legrand",
    email: "eleg@college",
    cell: "6127038623",
    address1: "place",
    address2: "",
    country: "USA",
    zipcode: "55419",
    city: "Minneapolis",
    state: "Minnesota",
  };
  store.dispatch(loginUser(dummyData));
}
