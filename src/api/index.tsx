import store from "@store";
import { loginUser, logoutUser } from "@store/User/UserActions";
import { User } from "@store/User/UserTypes";
import url from "url";

export const API_URL = "http://192.168.1.54:9000/api/login";

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
    store.dispatch(logoutUser());
  }, 2000);
}

/** Dummy function atm, once I implement mock login API calls (and then real calls) I will replace */
export async function login() {
  fetch("http://192.168.1.54:9000/api/login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "evan",
      password: "password",
    }),
  })
    .then((response) => response.json())
    .then((res) => {
      console.log("success");
      console.log(res);
    })
    .catch((err) => {
      console.log("failure");
      console.log(err);
    });
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
