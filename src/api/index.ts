import store from "@store";
import { Linking } from "react-native";
import { User, UserLoginInfo, UserRegisterInfo } from "@store/User/UserTypes";
import { dropdownError } from "@components/Dropdown/Dropdown.react";
import url from "url";
import * as SecureStore from "expo-secure-store";
import { Storage } from "types";
import { loginUser, logoutUser } from "@store/User/UserActions";
import { clearContacts } from "store/Contact/ContactActions";

const MOCK_API_IP = process.env.MOCK_API_IP;

export const API_URL = "http://" + MOCK_API_IP + ":9000/api/";

export interface UserResponse {
  type: string;
  data: User;
}

export function fetchTimeout(
  url: string,
  options: object,
  timeout = 3000
): Promise<Response> {
  return Promise.race([
    fetch(url, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), timeout)
    ),
  ]);
}

export async function saveToken(token: string) {
  return await SecureStore.setItemAsync(Storage.RememberToken, token);
}

export async function deleteToken() {
  return await SecureStore.deleteItemAsync(Storage.RememberToken);
}

export async function loginWithToken() {
  try {
    const rememberToken = await SecureStore.getItemAsync(Storage.RememberToken);
    if (!rememberToken) {
      store.dispatch(logoutUser());
      throw Error("Cannot load token");
    }
    const response = await fetchTimeout(url.resolve(API_URL, "login/token"), {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: rememberToken,
      }),
    });
    const body = await response.json();
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
  } catch (err) {
    store.dispatch(logoutUser());
    throw Error(err);
  }
}

export async function login(cred: UserLoginInfo) {
  const response = await fetchTimeout(url.resolve(API_URL, "login"), {
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
      // TODO: Once documentation is complete, ensure that this is wherere the info will be stored
      await saveToken(body.data[0].token);
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
  store.dispatch(logoutUser());
  store.dispatch(clearContacts());
  return await deleteToken();
}

export async function register(data: UserRegisterInfo) {
  const response = await fetchTimeout(url.resolve(API_URL, "register"), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  const body = await response.json();
  if (body.status == "ERROR") {
    throw Error(body.message);
  }
  if (data.remember) {
    try {
      // TODO: Once documentation is complete, ensure that this is wherere the info will be stored
      await saveToken(body.data[0].token);
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
