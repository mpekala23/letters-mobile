/* eslint-disable camelcase */
// The above is necessary because a lot of the responses from the server are forced snake case on us
import store from '@store';
import { Linking } from 'react-native';
import { User, UserLoginInfo, UserRegisterInfo } from '@store/User/UserTypes';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import url from 'url';
import { setItemAsync, getItemAsync, deleteItemAsync } from 'expo-secure-store';
import {
  Storage,
  Letter,
  Facility,
  LetterTrackingEvent,
  LetterTypes,
  LetterStatus,
} from 'types';
import { loginUser, logoutUser } from '@store/User/UserActions';
import {
  setAdding as setAddingContact,
  setExisting as setExistingContacts,
  clearContacts,
} from '@store/Contact/ContactActions';
import { Contact } from '@store/Contact/ContactTypes';
import {
  addLetter,
  setExisting as setExistingLetters,
} from '@store/Letter/LetterActions';
import i18n from '@i18n';
import { STATE_TO_ABBREV, ABBREV_TO_STATE } from '@utils';

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
    if (body.status !== 'OK') throw Error('Invalid token');
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
  if (body.status !== 'OK') {
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
  if (body.status !== 'OK' || body.exception) {
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

function cleanContact(data: RawContact): Contact {
  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    inmateNumber: data.inmate_number,
    relationship: data.relationship,
    credit: 4, // TODO: how do credits work on the backend? is this even in V0
    facility: {
      name: data.facility_name,
      type: 'Federal Prison', // TODO: does this field even exist on the backend?
      address: data.facility_address,
      city: data.facility_city,
      state: ABBREV_TO_STATE[data.facility_state],
      postal: data.facility_postal,
    },
  };
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

  if (body.status !== 'OK' || !body.data || !body.data.data) throw body;
  const existingContacts = body.data.data.map((contact: RawContact) =>
    cleanContact(contact)
  );
  store.dispatch(setExistingContacts(existingContacts));
  return existingContacts;
}

export async function getContact(id: number): Promise<Contact> {
  const response = await fetchAuthenticated(
    url.resolve(API_URL, `contact/${id}`),
    {
      method: 'GET',
    }
  );
  const body = await response.json();
  if (body.status !== 'OK' || !body.data) throw body;
  return cleanContact(body.data);
}

export async function addContact(data: Contact): Promise<Contact[]> {
  if (!data.facility) throw Error('No facility');
  const dormExtension = data.dorm ? { facility_dorm: data.dorm } : {};
  const unitExtension = data.unit ? { facility_unit: data.unit } : {};
  const response = await fetchAuthenticated(url.resolve(API_URL, 'contact'), {
    method: 'POST',
    body: JSON.stringify({
      first_name: data.firstName,
      last_name: data.lastName,
      inmate_number: data.inmateNumber,
      facility_name: data.facility.name,
      facility_address: data.facility.address,
      facility_city: data.facility.city,
      facility_state: STATE_TO_ABBREV[data.facility.state],
      facility_postal: data.facility.postal,
      ...dormExtension,
      ...unitExtension,
      relationship: data.relationship,
    }),
  });
  const body = await response.json();
  if (body.status !== 'OK') throw body;
  const newContact = { ...data, id: body.id };
  const { existing } = store.getState().contact;
  existing.push(newContact);
  store.dispatch(setExistingContacts(existing));
  store.dispatch(
    setAddingContact({
      id: -1,
      firstName: '',
      lastName: '',
      inmateNumber: '',
      relationship: '',
      facility: null,
      credit: 4,
    })
  );
  return existing;
}

export async function updateContact(data: Contact): Promise<Contact[]> {
  if (!data.facility) throw Error('No facility');
  const dormExtension = data.dorm ? { facility_dorm: data.dorm } : {};
  const unitExtension = data.unit ? { facility_unit: data.unit } : {};
  const response = await fetchAuthenticated(
    url.resolve(API_URL, `contact/${data.id}`),
    {
      method: 'PUT',
      body: JSON.stringify({
        first_name: data.firstName,
        last_name: data.lastName,
        inmate_number: data.inmateNumber,
        facility_name: data.facility.name,
        facility_address: data.facility.address,
        facility_city: data.facility.city,
        facility_state: data.facility.state,
        facility_postal: data.facility.postal,
        ...dormExtension,
        ...unitExtension,
        relationship: data.relationship,
      }),
    }
  );
  const body = await response.json();
  if (body.type === 'ERROR') throw body.data;
  const { existing } = store.getState().contact;
  const newExisting = [];
  for (let ix = 0; ix < existing.length; ix += 1) {
    if (existing[ix].id === data.id) {
      newExisting.push(data);
    } else {
      newExisting.push(existing[ix]);
    }
  }
  store.dispatch(setExistingContacts(newExisting));
  return newExisting;
}

export async function deleteContact(id: number): Promise<Contact[]> {
  const response = await fetchAuthenticated(
    url.resolve(API_URL, `contact/${id}`),
    {
      method: 'DELETE',
    }
  );
  const body = await response.json();
  if (body.type === 'ERROR') {
    throw Error(body.data);
  }
  const { existing } = store.getState().contact;
  const newExisting = existing.filter((contact) => contact.id !== id);
  store.dispatch(setExistingContacts(newExisting));
  return newExisting;
}

interface RawFacility {
  name: string;
  federal: number;
  address: string;
  city: string;
  state: string;
  postal: string;
}

function cleanFacility(facility: RawFacility): Facility {
  return {
    name: facility.name,
    type: facility.federal ? 'State Prison' : 'Federal Prison',
    address: facility.address,
    city: facility.city,
    state: facility.state,
    postal: facility.postal,
  };
}

export async function getFacilities(page = 1): Promise<Facility[]> {
  const params = new URLSearchParams({ page: page.toString() });
  const response = await fetchAuthenticated(
    url.resolve(API_URL, `facilities?${params}`),
    {
      method: 'GET',
    }
  );
  const body = await response.json();
  if (body.status !== 'OK' || !body.data || !body.data.data) throw body;
  const facilities = body.data.data.map((facility: RawFacility) =>
    cleanFacility(facility)
  );
  return facilities;
}

export async function getFacility(id: number): Promise<Facility> {
  const response = await fetchAuthenticated(
    url.resolve(API_URL, `facility/${id}`)
  );
  const body = await response.json();
  if (body.status !== 'OK' || !body.data) throw body;
  return body.data;
}

interface RawLetter {
  id: number;
  created_at: string;
  contact_id: number;
  content: string;
  sent: boolean;
  delivered: boolean;
  attached_img_src: string;
  type: LetterTypes;
  tracking_events: LetterTrackingEvent[];
}

// TODO: Once I know how to translate from a lob letter to front-end letter, fix this
function cleanLetter(letter: RawLetter): Letter {
  const { type } = letter;
  let status: LetterStatus;
  if (!letter.sent) {
    status = LetterStatus.Draft;
  } else {
    status = LetterStatus.Created;
  }
  const isDraft = !letter.sent;
  const recipientId: number = letter.contact_id;
  const { content } = letter;
  const photoPath = letter.attached_img_src;
  const letterId = letter.id;
  const expectedDeliveryDate = letter.created_at;
  const dateCreated = letter.created_at;
  const trackingEvents = letter.tracking_events;
  return {
    type,
    status,
    isDraft,
    recipientId,
    content,
    photoPath,
    letterId,
    expectedDeliveryDate,
    dateCreated,
    trackingEvents,
  };
}

export async function getLetters(page = 1): Promise<Record<number, Letter[]>> {
  const params = new URLSearchParams({ page: page.toString() });
  const response = await fetchAuthenticated(
    url.resolve(API_URL, `letters?${params}`),
    {
      method: 'GET',
    }
  );
  const body = await response.json();
  if (body.status !== 'OK' || !body.data || !body.data.data) throw body;
  const rawLetters: RawLetter[] = body.data.data;
  const existingLetters: Record<number, Letter[]> = {};
  for (let ix = 0; ix < rawLetters.length; ix += 1) {
    const rawLetter = rawLetters[ix];
    if (rawLetter.contact_id in existingLetters) {
      existingLetters[rawLetter.contact_id].push(cleanLetter(rawLetter));
    } else {
      existingLetters[rawLetter.contact_id] = [cleanLetter(rawLetter)];
    }
  }
  store.dispatch(setExistingLetters(existingLetters));
  return existingLetters;
}

export async function createLetter(letter: Letter): Promise<Letter> {
  let reqBody: Record<string, unknown> = {
    contact_id: letter.recipientId,
    content: letter.content,
    is_draft: letter.isDraft,
    s3_img_url: letter.photoPath,
    type: letter.type,
  };
  if (letter.letterId) {
    reqBody = { ...reqBody, letter_id: letter.letterId };
  }

  const response = await fetchAuthenticated(url.resolve(API_URL, 'letter'), {
    method: 'POST',
    body: JSON.stringify(reqBody),
  });
  const body = await response.json();
  if (body.status !== 'OK' || !body.data) throw body;
  // TODO: Figure out how letter_id is returned from actual API and update it here
  store.dispatch(addLetter(letter));
  return letter;
}

export async function facebookShare(shareUrl: string): Promise<void> {
  const supportedUrl = await Linking.canOpenURL(shareUrl);
  if (supportedUrl) {
    await Linking.openURL(shareUrl);
  } else {
    throw Error('Share Url not supported');
  }
}
