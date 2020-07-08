/* eslint-disable camelcase */
// The above is necessary because a lot of the responses from the server are forced snake case on us
import store from '@store';
import { Linking } from 'react-native';
import { User, UserLoginInfo, UserRegisterInfo } from '@store/User/UserTypes';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import url from 'url';
import { setItemAsync, getItemAsync, deleteItemAsync } from 'expo-secure-store';
import { Storage, Letter } from 'types';
import { loginUser, logoutUser } from '@store/User/UserActions';
import {
  setAdding,
  setExisting,
  clearContacts,
} from '@store/Contact/ContactActions';
import { Contact } from '@store/Contact/ContactTypes';
import { addLetter } from '@store/Letter/LetterActions';
import i18n from '@i18n';

const { MOCK_API_IP } = process.env;
export const MOCK_API_URL = `http://${MOCK_API_IP}:9000/api/`;

export const API_URL = 'https://letters-api-staging.ameelio.org/api/';

export interface UserResponse {
  type: string;
  data: User;
}

export function fetchTimeout(
  fetchUrl: string,
  options: Record<string, unknown>,
  timeout = 3000
): Promise<Response> {
  return Promise.race([
    fetch(fetchUrl, options),
    new Promise<Response>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), timeout)
    ),
  ]);
}

export async function fetchAuthenticated(
  fetchUrl: string,
  options: Record<string, unknown> = {},
  timeout = 3000
): Promise<Response> {
  const requestOptions = {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${store.getState().user.authInfo.apiToken}`,
    },
  };
  return fetchTimeout(fetchUrl, requestOptions, timeout);
}

export async function saveToken(token: string): Promise<void> {
  return setItemAsync(Storage.RememberToken, token);
}

export async function deleteToken(): Promise<void> {
  return deleteItemAsync(Storage.RememberToken);
}

export async function loginWithToken(): Promise<User> {
  try {
    const rememberToken = await getItemAsync(Storage.RememberToken);
    if (!rememberToken) {
      throw Error('Cannot load token');
    }
    const response = await fetchTimeout(url.resolve(API_URL, 'login/token'), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        token: rememberToken,
      }),
    });
    const body = await response.json();
    if (body.status === 'ERROR') throw Error('Invalid token');
    const userData: User = {
      id: body.data.id,
      firstName: body.data.first_name,
      lastName: body.data.last_name,
      email: body.data.email,
      phone: body.data.phone,
      address1: body.data.addr_line_1,
      address2: body.data.addr_line_2 || '',
      country: body.data.country,
      postal: body.data.postal,
      city: body.data.city,
      state: body.data.state,
    };
    store.dispatch(loginUser(userData, body.token));
    return userData;
  } catch (err) {
    store.dispatch(logoutUser());
    throw Error(err);
  }
}

export async function login(cred: UserLoginInfo): Promise<User> {
  const response = await fetchTimeout(url.resolve(API_URL, 'login'), {
    method: 'POST',
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
  if (body.status === 'ERROR') {
    throw body;
  }
  if (cred.remember) {
    try {
      // TODO: Once documentation is complete, ensure that this is wherere the info will be stored
      await saveToken(body.data.remember);
    } catch (err) {
      dropdownError({
        message: i18n.t('Error.unsavedToken'),
      });
    }
  }
  const userData: User = {
    id: body.data.id,
    firstName: body.data.first_name,
    lastName: body.data.last_name,
    email: body.data.email,
    phone: body.data.phone,
    address1: body.data.addr_line_1,
    address2: body.data.addr_line_2 || '',
    country: body.data.country,
    postal: body.data.postal,
    city: body.data.city,
    state: body.data.state,
  };
  store.dispatch(loginUser(userData, body.data.token));
  return userData;
}

export async function logout(): Promise<void> {
  store.dispatch(logoutUser());
  store.dispatch(clearContacts());
  return deleteToken();
}

export async function register(data: UserRegisterInfo): Promise<User> {
  const response = await fetchTimeout(url.resolve(API_URL, 'register'), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      password_confirmation: data.passwordConfirmation,
      first_name: data.firstName,
      last_name: data.lastName,
      address_line_1: data.address1,
      address_line_2: data.address2,
      city: data.city,
      state: data.state,
      country: data.country,
      referer: data.referer,
      postal: data.postal,
      phone: data.phone,
    }),
  });
  const body = await response.json();
  if (body.status === 'ERROR' || body.exception) {
    throw body;
  }
  if (data.remember) {
    try {
      // TODO: Once documentation is complete, ensure that this is wherere the info will be stored
      await saveToken(body.data.token);
    } catch (err) {
      dropdownError({
        message: i18n.t('Error.unsavedToken'),
      });
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
  store.dispatch(loginUser(userData, body.data.token));
  return userData;
}

interface RawContact {
  id: number;
  state: string;
  first_name: string;
  last_name: string;
  facility_state: string;
  inmate_number: string;
  relationship: string;
  facility_name: string;
  facility_address: string;
  facility_city: string;
  facility_postal: string;
}

export async function getContacts(page = 1): Promise<Contact[]> {
  const params = new URLSearchParams({ page: page.toString() });
  const response = await fetchAuthenticated(
    url.resolve(API_URL, `contacts?${params}`),
    {
      method: 'GET',
    }
  );
  const body = await response.json();
  const cleanContact = (data: RawContact): Contact => {
    return {
      id: data.id,
      state: data.facility_state,
      firstName: data.first_name,
      lastName: data.last_name,
      inmateNumber: data.inmate_number,
      relationship: data.relationship,
      facility: {
        name: data.facility_name,
        type: 'Federal Prison', // TODO: does this field even exist on the backend?
        address: data.facility_address,
        city: data.facility_city,
        state: data.facility_state,
        postal: data.facility_postal,
      },
    };
  };
  if (body.status === 'ERROR') throw body;
  const existingContacts = body.data.data.map((contact: RawContact) =>
    cleanContact(contact)
  );
  store.dispatch(setExisting(existingContacts));
  return existingContacts;
}

export async function addContact(
  data: Record<string, unknown>
): Promise<Contact[]> {
  const response = await fetchTimeout(url.resolve(MOCK_API_URL, 'contacts'), {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const body = await response.json();
  if (body.type === 'ERROR') {
    throw Error(body.data);
  }
  const contactData: Contact = {
    id: body.data.id,
    firstName: body.data.first_name,
    lastName: body.data.last_name,
    inmateNumber: body.data.inmate_number,
    state: body.data.state,
    relationship: body.data.relationship,
    facility: body.data.facility,
  };
  const { existing } = store.getState().contact;
  existing.push(contactData);
  store.dispatch(setExisting(existing));
  store.dispatch(
    setAdding({
      id: -1,
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

export async function updateContact(
  data: Record<string, unknown>
): Promise<Contact[]> {
  const response = await fetchTimeout(url.resolve(MOCK_API_URL, 'contacts'), {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const body = await response.json();
  if (body.type === 'ERROR') {
    throw Error(body.data);
  }
  const contactData: Contact = {
    id: body.data.id,
    firstName: body.data.first_name,
    lastName: body.data.last_name,
    inmateNumber: body.data.inmate_number,
    state: body.data.state,
    relationship: body.data.relationship,
    facility: body.data.facility,
  };
  const { existing } = store.getState().contact;
  const newExisting = [];
  for (let ix = 0; ix < existing.length; ix += 1) {
    if (existing[ix].id === contactData.id) {
      newExisting.push(contactData);
    } else {
      newExisting.push(existing[ix]);
    }
  }
  store.dispatch(setExisting(newExisting));
  return newExisting;
}

export async function deleteContact(data: Contact): Promise<Contact[]> {
  const response = await fetchTimeout(url.resolve(MOCK_API_URL, 'contacts'), {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  const body = await response.json();
  if (body.type === 'ERROR') {
    throw Error(body.data);
  }
  const { existing } = store.getState().contact;
  const newExisting = existing.filter((contact) => contact.id !== data.id);
  store.dispatch(setExisting(newExisting));
  return newExisting;
}

export async function facebookShare(shareUrl: string): Promise<void> {
  const supportedUrl = await Linking.canOpenURL(shareUrl);
  if (supportedUrl) {
    await Linking.openURL(shareUrl);
  } else {
    throw Error('Share Url not supported');
  }
}

export async function createLetter(letter: Letter): Promise<Letter> {
  let reqBody: Record<string, unknown> = {
    contact_id: letter.recipientId,
    content: letter.message,
    is_draft: letter.isDraft,
    s3_img_url: letter.photoPath,
    type: letter.type,
  };
  if (letter.letterId) {
    reqBody = { ...reqBody, letter_id: letter.letterId };
  }
  const options = {
    method: 'POST',
    body: JSON.stringify(reqBody),
  };
  const response = await fetchAuthenticated(
    url.resolve(MOCK_API_URL, 'letter'),
    options
  );
  const body = await response.json();
  if (body.type === 'ERROR') {
    throw Error(body.message);
  }
  // TODO: Figure out how letter_id is returned from actual API and update it here
  store.dispatch(addLetter(letter));
  return letter;
}
