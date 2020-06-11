import store from "@store";
import { Linking } from "react-native";
import { loginUser, logoutUser } from "@store/User/UserActions";
import { User, UserLoginInfo, UserRegisterInfo } from "@store/User/UserTypes";
import { dropdownError } from "@components/Dropdown/Dropdown.react";
import url from "url";
import * as SecureStore from "expo-secure-store";

const MOCK_API_IP = process.env.MOCK_API_IP;
enum Storage {
  Email = "Ameelio-Email",
}

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

export async function saveToken(user: UserLoginInfo) {
  try {
    await SecureStore.setItemAsync(Storage.Email, user.email);
    return;
  } catch (err) {
    throw Error(err);
  }
}

export async function loadToken() {
  try {
    const email = await SecureStore.getItemAsync(Storage.Email);
    if (!email) {
      store.dispatch(logoutUser());
      throw Error("Cannot load token");
    }
    // TODO: After API meeting, determine exactly what this stored token will look like, and how
    // It will be passed to the server on load here to get user data
    // For now this is just a dummy login call
    login({ email: email, password: "password", remember: true });
    return;
  } catch (err) {
    store.dispatch(logoutUser());
    throw Error(err);
  }
}

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
  if (cred.remember) {
    try {
      await saveToken(cred);
    } catch (err) {
      dropdownError(
        "Storage",
        "Unable to save login credentials for next time"
      );
    }
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

export async function logout() {
  try {
    await SecureStore.deleteItemAsync(Storage.Email);
    store.dispatch(logoutUser());
    return;
  } catch (err) {
    throw Error(err);
  }
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

export async function getFacilities(text: string) {}

export async function facebookShare(shareUrl: string) {
  const supportedUrl = await Linking.canOpenURL(shareUrl);
  if (supportedUrl) {
    await Linking.openURL(shareUrl);
  } else {
    throw Error("Share Url not supported");
  }
}
