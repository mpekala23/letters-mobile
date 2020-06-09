import store from "@store";
import { loginUser, logoutUser } from "@store/User/UserActions";
import { User, UserLoginInfo, UserRegisterInfo } from "@store/User/UserTypes";
import url from "url";

const MOCK_API_IP = process.env.MOCK_API_IP;

export const API_URL = "http://" + MOCK_API_IP + ":9000/api/";

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
    phone: "4324324432",
    address1: "Somewhere",
    country: "USA",
    postal: "12345",
    city: "New Haven",
    state: "CT",
  };
  setTimeout(() => {
    store.dispatch(logoutUser());
  }, 2000);
}

/** Dummy function atm, once I implement mock login API calls (and then real calls) I will replace */
export async function login(cred: UserLoginInfo) {
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
  const body = await response.json();
  if (body.status == "ERROR") {
    throw Error(body.message);
  }
  const userData: User = {
    id: body.data[0].id,
    firstName: body.data[0].first_name,
    lastName: body.data[0].last_name,
    email: body.data[0].email,
    phone: body.data[0].phone,
    address1: body.data[0].addr_line_1,
    address2: body.data[0].addr_line_2 || "",
    country: body.data[0].country,
    postal: body.data[0].postal,
    city: body.data[0].city,
    state: body.data[0].state,
  };
  store.dispatch(loginUser(userData));
  return userData;
}

export async function register(data: UserRegisterInfo) {
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
  const body = await response.json();
  if (body.status == "ERROR") {
    throw Error(body.message);
  }
  const userData: User = {
    id: body.data[0].id,
    firstName: body.data[0].first_name,
    lastName: body.data[0].last_name,
    email: body.data[0].email,
    phone: body.data[0].phone,
    address1: body.data[0].addr_line_1,
    address2: body.data[0].addr_line_2 || null,
    country: body.data[0].country,
    postal: body.data[0].postal,
    city: body.data[0].city,
    state: body.data[0].state,
  };
  store.dispatch(loginUser(userData));
  return userData;
}
