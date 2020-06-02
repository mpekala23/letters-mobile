import store from "@store";
import { loginUser, logoutUser } from "@store/User/UserActions";
import { User, UserCredentials, UserInfo } from "@store/User/UserTypes";
import url from "url";
import { fetch } from "isomorphic-fetch";

// this will change when running locally!
export const API_URL = "http://192.168.7.73:9000/api/";

url.resolve(API_URL, "fill later");

export interface UserResponse {
  type: string;
  data: User;
}

export function fetchTimeout<T>(
  url: string,
  options: object,
  timeout = 3000
): Promise<Response | T> {
  return Promise.race([
    fetch(url, options),
    new Promise<Response | T>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), timeout)
    ),
  ]);
}

/** Dummy function atm, once I implement persistent storage I will replace. */
export function loadToken() {
  const dummyData: User = {
    id: "6",
    firstName: "Team",
    lastName: "Ameelio",
    email: "team@ameelio.org",
    cell: "4324324432",
    address1: "Somewhere",
    country: "USA",
    zipcode: "12345",
    city: "New Haven",
    state: "CT",
  };
  setTimeout(() => {
    store.dispatch(logoutUser());
  }, 2000);
}

/** Dummy function atm, once I implement mock login API calls (and then real calls) I will replace */
export async function login(cred: UserCredentials) {
  const response = await fetchTimeout<Response>(url.resolve(API_URL, "login"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: cred.email,
      password: cred.password,
    }),
  });
  const res = await response.json();
  if (res.type == "error") {
    throw Error(res.data);
  }
  const userData: User = {
    id: res.data.id,
    firstName: res.data.firstName,
    lastName: res.data.lastName,
    email: res.data.email,
    cell: res.data.cell,
    address1: res.data.address1,
    address2: res.data.address2 || null,
    country: res.data.country,
    zipcode: res.data.zipCode,
    city: res.data.city,
    state: res.data.state,
  };
  store.dispatch(loginUser(userData));
  return userData;
}

export async function register(data: UserInfo) {
  const response = await fetchTimeout<Response>(
    url.resolve(API_URL, "register"),
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  const res = await response.json();
  if (res.type == "error") {
    throw Error(res.data);
  }
  const userData: User = {
    id: res.data.id,
    firstName: res.data.firstName,
    lastName: res.data.lastName,
    email: res.data.email,
    cell: res.data.cell,
    address1: res.data.address1,
    address2: res.data.address2 || null,
    country: res.data.country,
    zipcode: res.data.zipcode,
    city: res.data.city,
    state: res.data.state,
  };
  store.dispatch(loginUser(userData));
  return userData;
}
