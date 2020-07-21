/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
// The above is necessary because a lot of the responses from the server are forced snake case on us
import store from '@store';
import { User, UserLoginInfo, UserRegisterInfo } from '@store/User/UserTypes';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import url from 'url';
import { setItemAsync, getItemAsync, deleteItemAsync } from 'expo-secure-store';
import { Storage } from 'types';
import { loginUser, logoutUser, setUser } from '@store/User/UserActions';
import { clearContacts } from '@store/Contact/ContactActions';
import i18n from '@i18n';
import { STATE_TO_ABBREV, ABBREV_TO_STATE } from '@utils';
import {
  uploadImage,
  fetchTimeout,
  API_URL,
  fetchAuthenticated,
} from './Common';

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
    postal: user.postal,
    city: user.city,
    state: ABBREV_TO_STATE[user.state] || user.state,
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
      country: 'United States of America',
      state: STATE_TO_ABBREV[data.state],
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
        city: data.city,
        state: STATE_TO_ABBREV[data.state],
        postal: data.postal,
        country: 'United States of America',
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
