/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
// The above is necessary because a lot of the responses from the server are forced snake case on us
import store from '@store';
import { User, UserLoginInfo, UserRegisterInfo } from '@store/User/UserTypes';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import url from 'url';
import { setItemAsync, getItemAsync, deleteItemAsync } from 'expo-secure-store';
import { Storage, Letter, LetterTypes, LetterStatus } from 'types';
import {
  loginUser,
  logoutUser,
  setUser,
  authenticateUser,
} from '@store/User/UserActions';
import { clearContacts } from '@store/Contact/ContactActions';
import i18n from '@i18n';
import { STATE_TO_ABBREV, ABBREV_TO_STATE } from '@utils';
import * as Segment from 'expo-analytics-segment';
import { setComposing } from '@store/Letter/LetterActions';
import {
  uploadImage,
  fetchTimeout,
  API_URL,
  fetchAuthenticated,
} from './Common';
import { getContacts } from './Contacts';
import { getLetters } from './Letters';

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

export async function deleteDraft(): Promise<void> {
  await deleteItemAsync(Storage.DraftType);
  await deleteItemAsync(Storage.DraftContent);
  await deleteItemAsync(Storage.DraftRecipientId);
}

export async function saveDraft(letter: Letter): Promise<void> {
  await deleteDraft();
  await setItemAsync(Storage.DraftType, letter.type);
  await setItemAsync(Storage.DraftContent, letter.content);
  await setItemAsync(Storage.DraftRecipientId, letter.recipientId.toString());
}

export async function loadDraft(): Promise<Letter> {
  try {
    const draftType = await getItemAsync(Storage.DraftType);
    const draftContent = await getItemAsync(Storage.DraftContent);
    const draftRecipientId = await getItemAsync(Storage.DraftRecipientId);
    if (!draftType || !draftContent || !draftRecipientId)
      throw Error('No draft saved');
    const letter = {
      type: draftType as LetterTypes,
      status: LetterStatus.Draft,
      isDraft: true,
      recipientId: parseInt(draftRecipientId, 10),
      content: draftContent,
      dateCreated: new Date(),
      trackingEvents: [],
    };
    store.dispatch(setComposing(letter));
    return letter;
  } catch (err) {
    await deleteDraft();
    const letter = {
      type: LetterTypes.Postcard,
      status: LetterStatus.Draft,
      isDraft: true,
      recipientId: -1,
      content: '',
      dateCreated: new Date(),
      trackingEvents: [],
    };
    store.dispatch(setComposing(letter));
    return letter;
  }
}

export async function uploadPushToken(token: string): Promise<void> {
  const body = await fetchAuthenticated(
    url.resolve(API_URL, `exponent/devices/subscribe`),
    {
      method: 'POST',
      body: JSON.stringify({
        expo_token: token,
      }),
    }
  );
  if (body.status !== 'OK' && body.status !== 'succeeded') throw body;
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
    Segment.identify(userData.email);
    Segment.track('Login Success');
    store.dispatch(authenticateUser(userData, body.data.token, rememberToken));
    await Promise.all([getContacts(), getLetters()]);
    store.dispatch(loginUser(userData));
    await loadDraft();
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
  if (body.status !== 'OK') throw body;
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
  Segment.identify(userData.email);
  Segment.track('Login Success');
  store.dispatch(
    authenticateUser(userData, body.data.token, body.data.remember)
  );
  try {
    await Promise.all([getContacts(), getLetters()]);
  } catch (err) {
    dropdownError({ message: i18n.t('Error.loadingUser') });
  }
  store.dispatch(loginUser(userData));
  await loadDraft();
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
      country: 'US',
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
    authenticateUser(userData, body.data.token, body.data.remember)
  );
  Segment.identifyWithTraits(userData.email, {
    name: `${userData.firstName} ${userData.lastName}`,
    email: userData.email,
    phone: userData.phone,
    postal: userData.postal,
    city: userData.city,
    state: userData.state,
    referrer: data.referer,
  });

  store.dispatch(loginUser(userData));
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
        country: 'US',
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
