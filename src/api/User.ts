/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
// The above is necessary because a lot of the responses from the server are forced snake case on us
import store from '@store';
import { User, UserLoginInfo, UserRegisterInfo } from '@store/User/UserTypes';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import url from 'url';
import { setItemAsync, getItemAsync, deleteItemAsync } from 'expo-secure-store';
import { Storage, MailTypes, Draft, PostcardDesign } from 'types';
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
import { setComposing } from '@store/Mail/MailActions';
import {
  uploadImage,
  fetchTimeout,
  API_URL,
  fetchAuthenticated,
} from './Common';
import { getContacts } from './Contacts';
import { getMail, getSubcategoriesById, getCategories } from './Mail';

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
    address1: user.addr_line_1,
    address2: user.addr_line_2,
    postal: user.postal,
    city: user.city,
    state: ABBREV_TO_STATE[user.state] || user.state,
    photo: {
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
  await deleteItemAsync(Storage.DraftDesignUri);
  await deleteItemAsync(Storage.DraftCategoryId);
  await deleteItemAsync(Storage.DraftSubcategoryName);
}

export async function saveDraft(draft: Draft): Promise<void> {
  await deleteDraft();
  await setItemAsync(Storage.DraftType, draft.type);
  await setItemAsync(Storage.DraftContent, draft.content);
  await setItemAsync(Storage.DraftRecipientId, draft.recipientId.toString());
  if (
    draft.type === MailTypes.Postcard &&
    draft.design.image.uri &&
    draft.design.categoryId &&
    draft.design.subcategoryName
  ) {
    await setItemAsync(Storage.DraftDesignUri, draft.design.image.uri);
    await setItemAsync(
      Storage.DraftCategoryId,
      draft.design.categoryId.toString()
    );
    await setItemAsync(
      Storage.DraftSubcategoryName,
      draft.design.subcategoryName
    );
  } else {
    await deleteItemAsync(Storage.DraftDesignUri);
    await deleteItemAsync(Storage.DraftCategoryId);
    await deleteItemAsync(Storage.DraftSubcategoryName);
  }
}

export async function loadDraft(): Promise<Draft> {
  try {
    const draftType = await getItemAsync(Storage.DraftType);
    const draftContent = await getItemAsync(Storage.DraftContent);
    const draftRecipientId = await getItemAsync(Storage.DraftRecipientId);
    if (!draftType || !draftRecipientId) throw Error('No draft saved');
    if (draftType === MailTypes.Letter) {
      const draft: Draft = {
        type: MailTypes.Letter,
        recipientId: parseInt(draftRecipientId, 10),
        content: draftContent || '',
      };
      store.dispatch(setComposing(draft));
      return draft;
    }
    if (draftType === MailTypes.Postcard) {
      const draftDesignUri = await getItemAsync(Storage.DraftDesignUri);
      const draftCategoryId = await getItemAsync(Storage.DraftCategoryId);
      const draftSubcategoryName = await getItemAsync(
        Storage.DraftSubcategoryName
      );
      if (!draftDesignUri || !draftCategoryId || !draftSubcategoryName)
        throw Error('Unable to load postcard design');
      const subcategories = await getSubcategoriesById(
        parseInt(draftCategoryId, 10)
      );
      const findDesign = subcategories[draftSubcategoryName].find(
        (testDesign: PostcardDesign) => testDesign.image.uri === draftDesignUri
      );
      if (!findDesign) throw Error('Unable to load postcard design');
      const draft: Draft = {
        type: MailTypes.Postcard,
        recipientId: parseInt(draftRecipientId, 10),
        content: draftContent || '',
        design: findDesign,
      };
      store.dispatch(setComposing(draft));
      return draft;
    }
    await deleteDraft();
    const draft: Draft = {
      type: MailTypes.Letter,
      recipientId: -1,
      content: '',
    };
    store.dispatch(setComposing(draft));
    return draft;
  } catch (err) {
    await deleteDraft();
    const draft: Draft = {
      type: MailTypes.Letter,
      recipientId: -1,
      content: '',
    };
    store.dispatch(setComposing(draft));
    return draft;
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
    if (body.status !== 'OK') throw body;
    const userData = cleanUser(body.data as RawUser);
    Segment.identify(userData.email);
    Segment.track('Login Success');
    store.dispatch(authenticateUser(userData, body.data.token, rememberToken));
    await Promise.all([getContacts(), getMail()]);
    store.dispatch(loginUser(userData));
    await loadDraft();
    getCategories().catch(() => {
      /* do nothing */
    });
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
    await Promise.all([getContacts(), getMail()]);
    await loadDraft();
  } catch (err) {
    dropdownError({ message: i18n.t('Error.loadingUser') });
  }
  store.dispatch(loginUser(userData));
  getCategories().catch(() => {
    /* do nothing */
  });
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
  if (data.image) {
    try {
      newPhoto = await uploadImage(data.image, 'avatar');
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
      state: STATE_TO_ABBREV[data.phyState],
      referer: data.referrer,
      postal: data.postal,
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
    postal: userData.postal,
    city: userData.city,
    state: userData.state,
    referrer: data.referrer,
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
