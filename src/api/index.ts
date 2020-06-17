import store from "@store";
import { Linking } from "react-native";
import { User, UserLoginInfo, UserRegisterInfo } from "@store/User/UserTypes";
import { dropdownError } from "@components/Dropdown/Dropdown.react";
import url from "url";
import { setItemAsync, getItemAsync, deleteItemAsync } from "expo-secure-store";
import { Storage } from "types";
import { loginUser, logoutUser } from "@store/User/UserActions";
import { setAdding, setExisting, clearContacts } from "store/Contact/ContactActions";
import "isomorphic-fetch";
import { Contact } from '@store/Contact/ContactTypes';

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
  return await setItemAsync(Storage.RememberToken, token);
}

export async function deleteToken() {
  return await deleteItemAsync(Storage.RememberToken);
}

export async function loginWithToken() {
  try {
    const rememberToken = await getItemAsync(Storage.RememberToken);
    if (!rememberToken) {
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
    if (body.status === "ERROR") throw Error("Invalid token");
    const userData: User = {
      id: body.data.id,
      firstName: body.data.first_name,
      lastName: body.data.last_name,
      email: body.data.email,
      phone: body.data.phone,
      address1: body.data.addr_line_1,
      address2: body.data.addr_line_2 || "",
      country: body.data.country,
      postal: body.data.postal,
      city: body.data.city,
      state: body.data.state,
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
      Accept: 'application/json',
      'Content-Type': 'application/json',
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
      await saveToken(body.data.token);
    } catch (err) {
      dropdownError(
        "Storage",
        "Unable to save login credentials for next time"
      );
    }
  }
  const userData: User = {
    id: body.data.id,
    firstName: body.data.first_name,
    lastName: body.data.last_name,
    email: body.data.email,
    phone: body.data.phone,
    address1: body.data.addr_line_1,
    address2: body.data.addr_line_2 || "",
    country: body.data.country,
    postal: body.data.postal,
    city: body.data.city,
    state: body.data.state,
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
    body: JSON.stringify({
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      phone: data.phone,
      addr_line_1: data.address1,
      addr_line_2: data.address2,
      country: data.country,
      postal: data.postal,
      city: data.city,
      state: data.state,
    }),
  });
  const body = await response.json();
  if (body.status == "ERROR") {
    throw Error(body.message);
  }
  if (data.remember) {
    try {
      // TODO: Once documentation is complete, ensure that this is wherere the info will be stored
      await saveToken(body.data.token);
    } catch (err) {
      dropdownError(
        "Storage",
        "Unable to save login credentials for next time"
      );
    }
  }
  const userData: User = {
    id: body.data.id,
    firstName: body.data.first_name,
    lastName: body.data.last_name,
    email: body.data.email,
    phone: body.data.phone,
    address1: body.data.addr_line_1,
    address2: body.data.addr_line_2 || null,
    country: body.data.country,
    postal: body.data.postal,
    city: body.data.city,
    state: body.data.state,
  };
  store.dispatch(loginUser(userData));
  return userData;
}

export async function getFacilities(text: string) {}

export async function addContact(data: {}) {
  const response = await fetchTimeout(url.resolve(API_URL, 'contacts'), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const body = await response.json();
  if (body.type == 'ERROR') {
    throw Error(body.data);
  }
  const contactData: Contact = {
    firstName: body.data.first_name,
    lastName: body.data.last_name,
    inmateNumber: body.data.inmate_number,
    state: body.data.state,
    relationship: body.data.relationship,
    facility: body.data.facility,
  };
  const { existing } = store.getState().contact;
  // Add contact to existing list of contacts
  existing.push(contactData);
  store.dispatch(setExisting(existing));
  store.dispatch(
    setAdding({
      state: '',
      firstName: '',
      lastName: '',
      inmateNumber: '',
      relationship: '',
      facility: null,
    })
  );
  return existing;
}

export async function facebookShare(shareUrl: string) {
  const supportedUrl = await Linking.canOpenURL(shareUrl);
  if (supportedUrl) {
    await Linking.openURL(shareUrl);
  } else {
    throw Error('Share Url not supported');
  }
}
