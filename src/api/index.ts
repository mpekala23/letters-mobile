/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
// The above is necessary because a lot of the responses from the server are forced snake case on us
import store from '@store';
import { Linking, Platform } from 'react-native';
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
  ZipcodeInfo,
  Photo,
  PrisonTypes,
} from 'types';
import { loginUser, logoutUser, setUser } from '@store/User/UserActions';
import {
  setAdding as setAddingContact,
  setExisting as setExistingContacts,
  clearContacts,
  setActive as setActiveContact,
} from '@store/Contact/ContactActions';
import { Contact } from '@store/Contact/ContactTypes';
import {
  addLetter,
  setExisting as setExistingLetters,
} from '@store/Letter/LetterActions';
import i18n from '@i18n';
import { STATE_TO_ABBREV, ABBREV_TO_STATE } from '@utils';

export const GENERAL_URL = 'https://letters-api-staging.ameelio.org/';
export const API_URL = 'https://letters-api-staging.ameelio.org/api/';

export interface ApiResponse {
  date: number;
  status?: 'OK' | 'ERROR';
  message?: string;
  data: Record<string, unknown> | Record<string, unknown>[] | unknown;
}

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
): Promise<ApiResponse> {
  const requestOptions = {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${store.getState().user.authInfo.apiToken}`,
    },
  };
  const response = await fetchTimeout(fetchUrl, requestOptions, timeout);
  const body = await response.json();
  const { rememberToken } = store.getState().user.authInfo;
  if (
    body.message &&
    body.message === 'Unauthenticated.' &&
    rememberToken !== ''
  ) {
    // attempt to refresh the api token using the remember token
    const tokenResponse = await fetchTimeout(
      url.resolve(API_URL, 'login/token'),
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: rememberToken,
        }),
      }
    );
    const tokenBody = await tokenResponse.json();
    if (tokenBody.status !== 'OK') {
      store.dispatch(logoutUser());
      throw Error('Invalid token');
    }
    const userData: User = {
      id: tokenBody.data.id,
      firstName: tokenBody.data.first_name,
      lastName: tokenBody.data.last_name,
      email: tokenBody.data.email,
      phone: tokenBody.data.phone,
      address1: tokenBody.data.addr_line_1,
      address2: tokenBody.data.addr_line_2 || '',
      country: tokenBody.data.country,
      postal: tokenBody.data.postal,
      city: tokenBody.data.city,
      state: tokenBody.data.state,
      credit: tokenBody.data.credit,
      joined: tokenBody.data.created_at,
    };
    store.dispatch(
      loginUser(userData, tokenBody.data.token, tokenBody.data.remember)
    );
    // successfully logged in using the remember token, retry the original api call
    const retryOptions = {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${store.getState().user.authInfo.apiToken}`,
      },
    };
    const retryResponse = await fetchTimeout(fetchUrl, retryOptions, timeout);
    const retryBody = await retryResponse.json();
    return retryBody;
  }
  return body;
}

interface RawUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  addr_line_1: string;
  addr_line_2: string;
  city: string;
  state: string;
  postal: string;
  credit: number;
  s3_img_url?: string;
  profile_img_path?: string;
  phone: string;
  referer: string;
  country: string;
  created_at: string;
}

function cleanUser(user: RawUser): User {
  const photoUri = user.s3_img_url || user.profile_img_path;
  return {
    id: user.id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
    address1: user.addr_line_1,
    address2: user.addr_line_2,
    country: user.country,
    postal: user.postal,
    city: user.city,
    state: ABBREV_TO_STATE[user.state],
    photo: {
      type: 'image/jpeg',
      uri: photoUri || '',
    },
    credit: user.credit,
    joined: new Date(user.created_at),
  };
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
    const userData = cleanUser(body.data as RawUser);
    store.dispatch(loginUser(userData, body.data.token, body.data.remember));
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
      await saveToken(body.data.remember);
    } catch (err) {
      dropdownError({
        message: i18n.t('Error.unsavedToken'),
      });
    }
  }
  const userData = cleanUser(body.data as RawUser);
  store.dispatch(loginUser(userData, body.data.token, body.data.remember));
  return userData;
}

export async function logout(): Promise<void> {
  store.dispatch(logoutUser());
  store.dispatch(clearContacts());
  return deleteToken();
}

export async function uploadImage(
  image: Photo,
  type: 'avatar' | 'letter'
): Promise<Photo> {
  const data = new FormData();

  const photo = {
    name: store.getState().user.user.id.toString() + Date.now().toString(),
    type: 'image/jpeg',
    path:
      Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
    uri:
      Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
  };

  data.append('img', photo);
  data.append('type', type);

  const response = await fetchTimeout(
    url.resolve(GENERAL_URL, 'image/upload'),
    {
      method: 'POST',
      body: data,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${store.getState().user.authInfo.apiToken}`,
      },
    },
    20000
  );
  const body: ApiResponse = await response.json();
  if (body.status !== 'OK') throw body;

  return {
    uri: body.data as string,
    type: 'image/jpeg',
  };
}

export async function register(data: UserRegisterInfo): Promise<User> {
  let photoExtension = {};
  let newPhoto;
  if (data.photo) {
    try {
      newPhoto = await uploadImage(data.photo, 'avatar');
      photoExtension = { s3_img_url: newPhoto.uri };
    } catch (err) {
      dropdownError({ message: i18n.t('Error.unableToUploadProfilePicture') });
    }
  }
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
      state: STATE_TO_ABBREV[data.state],
      country: data.country,
      referer: data.referer,
      postal: data.postal,
      phone: data.phone,
      ...photoExtension,
    }),
  });
  const body = await response.json();
  if (body.status !== 'OK' || body.exception) throw body;
  await logout();
  if (data.remember) {
    try {
      await saveToken(body.data.remember);
    } catch (err) {
      dropdownError({
        message: i18n.t('Error.unsavedToken'),
      });
    }
  }
  const userData = cleanUser(body.data as RawUser);
  userData.photo = newPhoto;
  store.dispatch(
    loginUser(
      userData,
      body.data.token,
      body.data.remember ? body.data.remember : ''
    )
  );
  return userData;
}

export async function getUser(): Promise<User> {
  const body = await fetchAuthenticated(
    url.resolve(API_URL, `user/${store.getState().user.user.id}`),
    {
      method: 'GET',
    }
  );
  if (body.status !== 'OK') throw body;
  const userData = cleanUser(body.data as RawUser);
  store.dispatch(setUser(userData));
  return userData;
}

export async function updateProfile(data: User): Promise<User> {
  let newPhoto = data.photo ? { ...data.photo } : undefined;
  const existingPhoto = store.getState().user.user.photo;
  if (
    newPhoto &&
    ((existingPhoto && newPhoto.uri !== existingPhoto.uri) || !existingPhoto)
  ) {
    // there is a new photo and it is different from the existing photo (or there is no existing photo)
    try {
      newPhoto = await uploadImage(newPhoto, 'avatar');
    } catch (err) {
      newPhoto = undefined;
      dropdownError({ message: i18n.t('Error.unableToUploadProfilePicture') });
    }
  }
  const body = await fetchAuthenticated(
    url.resolve(API_URL, `user/${store.getState().user.user.id}`),
    {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: data.id,
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: data.phone,
        addr_line_1: data.address1,
        addr_line_2: data.address2,
        country: data.country,
        postal: data.postal,
        city: data.city,
        state: data.state,
        s3_img_url: newPhoto?.uri,
      }),
    }
  );
  if (body.status !== 'OK') throw body;
  const userData = cleanUser(body.data as RawUser);
  userData.photo = newPhoto;
  store.dispatch(setUser(userData));
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
  s3_img_url?: string;
  profile_img_path?: string;
}

function cleanContact(data: RawContact): Contact {
  const photoExtension =
    data.s3_img_url || data.profile_img_path
      ? {
          photo: {
            type: 'image/jpeg',
            uri: data.s3_img_url || data.profile_img_path || '',
          },
        }
      : {};
  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    inmateNumber: data.inmate_number,
    relationship: data.relationship,
    facility: {
      name: data.facility_name,
      type: PrisonTypes.Federal, // TODO: once this is supported on the backend, update this field
      address: data.facility_address,
      city: data.facility_city,
      state: ABBREV_TO_STATE[data.facility_state],
      postal: data.facility_postal,
    },
    ...photoExtension,
  };
}

export async function getContacts(page = 1): Promise<Contact[]> {
  const params = new URLSearchParams({ page: page.toString() });
  const body = await fetchAuthenticated(
    url.resolve(API_URL, `contacts?${params}`),
    {
      method: 'GET',
    }
  );
  const data = body.data as { data: RawContact[] };
  if (body.status !== 'OK' || !data || !data.data) throw body;
  const existingContacts = data.data.map((contact: RawContact) =>
    cleanContact(contact)
  );
  store.dispatch(setExistingContacts(existingContacts));
  return existingContacts;
}

export async function getContact(id: number): Promise<Contact> {
  const body = await fetchAuthenticated(url.resolve(API_URL, `contact/${id}`), {
    method: 'GET',
  });
  if (body.status !== 'OK' || !body.data) throw body;
  return cleanContact(body.data as RawContact);
}

export async function addContact(contactData: Contact): Promise<Contact[]> {
  if (!contactData.facility) throw Error('No facility');
  const dormExtension = contactData.dorm
    ? { facility_dorm: contactData.dorm }
    : {};
  const unitExtension = contactData.unit
    ? { facility_unit: contactData.unit }
    : {};
  const body = await fetchAuthenticated(url.resolve(API_URL, 'contact'), {
    method: 'POST',
    body: JSON.stringify({
      first_name: contactData.firstName,
      last_name: contactData.lastName,
      inmate_number: contactData.inmateNumber,
      facility_name: contactData.facility.name,
      facility_address: contactData.facility.address,
      facility_city: contactData.facility.city,
      facility_state: STATE_TO_ABBREV[contactData.facility.state],
      facility_postal: contactData.facility.postal,
      ...dormExtension,
      ...unitExtension,
      relationship: contactData.relationship,
    }),
  });
  if (body.status !== 'OK') throw body;
  const data = body.data as Contact;
  const newContact = { ...data, id: data.id };
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
    })
  );
  return existing;
}

export async function updateContact(data: Contact): Promise<Contact[]> {
  if (!data.facility) throw Error('No facility');
  let newPhoto = data.photo ? { ...data.photo } : undefined;
  const existingPhoto = store.getState().contact.active.photo;
  if (
    newPhoto &&
    ((existingPhoto && newPhoto.uri !== existingPhoto.uri) || !existingPhoto)
  ) {
    // there is a new photo and it is different from the existing photo (or there is no existing photo)
    try {
      newPhoto = await uploadImage(newPhoto, 'avatar');
    } catch (err) {
      newPhoto = undefined;
      dropdownError({ message: 'Error.unableToUploadContactPicture' });
    }
  }
  const dormExtension = data.dorm ? { facility_dorm: data.dorm } : {};
  const unitExtension = data.unit ? { facility_unit: data.unit } : {};
  const body = await fetchAuthenticated(
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
        facility_state: STATE_TO_ABBREV[data.facility.state],
        facility_postal: data.facility.postal,
        ...dormExtension,
        ...unitExtension,
        s3_img_url: newPhoto?.uri,
        relationship: data.relationship,
      }),
    }
  );
  if (body.status === 'ERROR') throw body.data;
  const updatedContact = { ...data };
  updatedContact.photo = newPhoto;
  const { existing } = store.getState().contact;
  const newExisting = [];
  for (let ix = 0; ix < existing.length; ix += 1) {
    if (existing[ix].id === updatedContact.id) {
      newExisting.push(updatedContact);
    } else {
      newExisting.push(existing[ix]);
    }
  }
  store.dispatch(setExistingContacts(newExisting));
  store.dispatch(setActiveContact(updatedContact));
  return newExisting;
}

export async function deleteContact(id: number): Promise<Contact[]> {
  const body = await fetchAuthenticated(url.resolve(API_URL, `contact/${id}`), {
    method: 'DELETE',
  });
  if (body.status === 'ERROR') throw body;
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
    type: facility.federal ? PrisonTypes.Federal : PrisonTypes.State,
    address: facility.address,
    city: facility.city,
    state: ABBREV_TO_STATE[facility.state],
    postal: facility.postal,
  };
}

export async function getFacilities(state: string): Promise<Facility[]> {
  const path = url.resolve(API_URL, `facility/query/state/${state}`);
  const body = await fetchAuthenticated(path, {
    method: 'GET',
  });
  const data = body.data as RawFacility[];
  if (body.status !== 'OK' || !data || !data) throw body;
  const facilities = data.map((facility: RawFacility) =>
    cleanFacility(facility)
  );
  return facilities;
}

export async function getFacility(id: number): Promise<Facility> {
  const body = await fetchAuthenticated(url.resolve(API_URL, `facility/${id}`));
  if (body.status !== 'OK' || !body.data) throw body;
  return body.data as Facility;
}

interface RawTrackingEvent {
  id: number;
  name: string;
  date: string;
  location: string;
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
  tracking_events?: RawTrackingEvent[];
}

export async function getZipcode(zipcode: string): Promise<ZipcodeInfo> {
  const body = await fetchAuthenticated(
    url.resolve(API_URL, `zips/${zipcode}`),
    {
      method: 'GET',
    }
  );
  if (body.status !== 'OK' || !body.data) throw body;
  const data = body.data as {
    zip: string;
    city: string;
    state_id: string;
  };
  return {
    zip: data.zip,
    city: data.city,
    state: ABBREV_TO_STATE[data.state_id],
  };
}

async function cleanTrackingEvent(
  event: RawTrackingEvent
): Promise<LetterTrackingEvent> {
  const location = await getZipcode(event.location);
  return {
    id: event.id,
    name: event.name,
    location,
    date: new Date(event.date),
  };
}

async function cleanLetter(letter: RawLetter): Promise<Letter> {
  const { type } = letter;
  let status: LetterStatus;
  const trackingEvents = !letter.tracking_events
    ? []
    : await Promise.all(
        letter.tracking_events.map((rawEvent) => cleanTrackingEvent(rawEvent))
      );
  if (!letter.sent) {
    status = LetterStatus.Draft;
  } else {
    let inTransit = false;
    let processedForDelivery = false;
    let processedForDeliveryDate = new Date(Date.now());
    for (let ix = 0; ix < trackingEvents.length; ix += 1) {
      inTransit = inTransit || trackingEvents[ix].name === 'In Transit';
      processedForDelivery =
        processedForDelivery ||
        trackingEvents[ix].name === 'Processed for Delivery';
      if (trackingEvents[ix].name === 'Processed for Delivery') {
        processedForDeliveryDate = trackingEvents[ix].date;
      }
    }
    if (!inTransit) {
      status = LetterStatus.Created;
    } else if (!processedForDelivery) {
      status = LetterStatus.Mailed;
    } else {
      const now = new Date(Date.now());
      const timeDiff = now.getTime() - processedForDeliveryDate.getTime();
      const dayDiff = timeDiff / (1000 * 3600 * 24);
      if (dayDiff <= 5) {
        status = LetterStatus.OutForDelivery;
      } else {
        status = LetterStatus.Delivered;
      }
    }
  }
  const isDraft = !letter.sent;
  const recipientId: number = letter.contact_id;
  const { content } = letter;
  const photo = {
    type: 'image/jpeg',
    uri: letter.attached_img_src,
  };
  const letterId = letter.id;
  const expectedDeliveryDate = letter.created_at;
  const dateCreated = letter.created_at;
  return {
    type,
    status,
    isDraft,
    recipientId,
    content,
    photo,
    letterId,
    expectedDeliveryDate,
    dateCreated,
    trackingEvents,
  };
}

export async function getLetters(page = 1): Promise<Record<number, Letter[]>> {
  const params = new URLSearchParams({ page: page.toString() });
  const body = await fetchAuthenticated(
    url.resolve(API_URL, `letters?${params}`),
    {
      method: 'GET',
    }
  );
  const data = body.data as { current_page: number; data: RawLetter[] };
  if (body.status !== 'OK' || !data || !data.data) throw body;
  const existingLetters: Record<number, Letter[]> = {};
  for (let ix = 0; ix < data.data.length; ix += 1) {
    const rawLetter = data.data[ix];
    if (rawLetter.contact_id in existingLetters) {
      existingLetters[rawLetter.contact_id].push(await cleanLetter(rawLetter));
    } else {
      existingLetters[rawLetter.contact_id] = [await cleanLetter(rawLetter)];
    }
  }
  store.dispatch(setExistingLetters(existingLetters));
  return existingLetters;
}

export async function createLetter(letter: Letter): Promise<Letter> {
  const createdLetter = { ...letter };
  let imageExtension = {};
  if (createdLetter.photo) {
    try {
      createdLetter.photo = await uploadImage(createdLetter.photo, 'letter');
      imageExtension = { s3_img_url: createdLetter.photo.uri };
    } catch (err) {
      const uploadError: ApiResponse = {
        status: 'ERROR',
        message: 'Unable to upload image.',
        date: Date.now(),
        data: {},
      };
      throw uploadError;
    }
  }
  const letterExtension = createdLetter.letterId
    ? { letter_id: createdLetter.letterId }
    : {};
  const reqBody: Record<string, unknown> = {
    contact_id: createdLetter.recipientId,
    content: createdLetter.content,
    is_draft: createdLetter.isDraft,
    type: createdLetter.type,
    ...imageExtension,
    ...letterExtension,
  };

  const body = await fetchAuthenticated(url.resolve(API_URL, 'letter'), {
    method: 'POST',
    body: JSON.stringify(reqBody),
  });
  if (body.status !== 'OK' || !body.data) throw body;
  // TODO: Figure out how letter_id is returned from actual API and update it here
  store.dispatch(addLetter(createdLetter));
  return createdLetter;
}

export async function facebookShare(shareUrl: string): Promise<void> {
  const supportedUrl = await Linking.canOpenURL(shareUrl);
  if (supportedUrl) {
    await Linking.openURL(shareUrl);
  } else {
    throw Error('Share Url not supported');
  }
}
