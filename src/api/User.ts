/* eslint-disable no-await-in-loop */
/* eslint-disable camelcase */
// The above is necessary because a lot of the responses from the server are forced snake case on us
import store from '@store';
import { User, UserLoginInfo, UserRegisterInfo } from '@store/User/UserTypes';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import url from 'url';
import { setItemAsync, getItemAsync, deleteItemAsync } from 'expo-secure-store';
import {
  Storage,
  MailTypes,
  Draft,
  PostcardDesign,
  FamilyConnection,
  UserReferralsInfo,
} from 'types';
import {
  loginUser,
  logoutUser,
  setUser,
  authenticateUser,
  setUserReferrals,
  setLoadingStatus,
} from '@store/User/UserActions';
import { clearContacts } from '@store/Contact/ContactActions';
import i18n from '@i18n';
import { STATE_TO_ABBREV, ABBREV_TO_STATE, sleep } from '@utils';
import * as Segment from 'expo-analytics-segment';
import { setComposing } from '@store/Mail/MailActions';
import * as Sentry from 'sentry-expo';
import { getPushToken } from '@notifications';
import { PERSONAL_OVERRIDE_ID } from '@utils/Constants';
import {
  uploadImage,
  fetchTimeout,
  API_URL,
  fetchAuthenticated,
  ApiResponse,
} from './Common';
import { getContacts } from './Contacts';
import { getSubcategoriesById, getCategories, initMail } from './Mail';

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
  referral_link: string;
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
    referralCode: user.referral_link,
  };
}

export async function saveToken(token: string): Promise<void> {
  return setItemAsync(Storage.RememberToken, token);
}

export async function deleteToken(): Promise<void> {
  return deleteItemAsync(Storage.RememberToken);
}

export async function deleteDraft(): Promise<void> {
  Promise.all([
    deleteItemAsync(Storage.DraftType),
    deleteItemAsync(Storage.DraftContent),
    deleteItemAsync(Storage.DraftRecipientId),
    deleteItemAsync(Storage.DraftImages),
    deleteItemAsync(Storage.DraftDesignUri),
    deleteItemAsync(Storage.DraftCategoryId),
    deleteItemAsync(Storage.DraftSubcategoryName),
    deleteItemAsync(Storage.DraftLayout),
  ]);
}

export async function saveDraft(draft: Draft): Promise<void> {
  await deleteDraft();
  Promise.all([
    setItemAsync(Storage.DraftType, draft.type),
    setItemAsync(Storage.DraftContent, draft.content),
    setItemAsync(Storage.DraftRecipientId, draft.recipientId.toString()),
  ]);
  if (draft.type === MailTypes.Letter) {
    await setItemAsync(Storage.DraftImages, JSON.stringify(draft.images));
  } else {
    setItemAsync(
      Storage.DraftCategoryId,
      draft.design.categoryId
        ? draft.design.categoryId.toString()
        : PERSONAL_OVERRIDE_ID.toString()
    );
    if (draft.design.layout) {
      // personal postcard
      Promise.all([
        setItemAsync(Storage.DraftLayout, JSON.stringify(draft.design.layout)),
      ]);
    } else if (draft.design.image.uri && draft.design.subcategoryName) {
      Promise.all([
        setItemAsync(Storage.DraftDesignUri, draft.design.image.uri),
        setItemAsync(
          Storage.DraftSubcategoryName,
          draft.design.subcategoryName
        ),
      ]);
    }
  }
}

export async function loadDraft(): Promise<Draft> {
  try {
    const draftType = await getItemAsync(Storage.DraftType);
    const draftContent = await getItemAsync(Storage.DraftContent);
    const draftRecipientId = await getItemAsync(Storage.DraftRecipientId);
    if (!draftType || !draftRecipientId) {
      await deleteDraft();
      const draft: Draft = {
        type: MailTypes.Letter,
        recipientId: -1,
        content: '',
        images: [],
      };
      store.dispatch(setComposing(draft));
      return draft;
    }
    if (draftType === MailTypes.Letter) {
      const draftImages = await getItemAsync(Storage.DraftImages);
      const draft: Draft = {
        type: MailTypes.Letter,
        recipientId: parseInt(draftRecipientId, 10),
        content: draftContent || '',
        images: draftImages ? JSON.parse(draftImages) : [],
      };
      store.dispatch(setComposing(draft));
      return draft;
    }
    if (draftType === MailTypes.Postcard) {
      const draftDesignUri = await getItemAsync(Storage.DraftDesignUri);
      const draftCategoryId = await getItemAsync(Storage.DraftCategoryId);
      let draftSubcategoryName = await getItemAsync(
        Storage.DraftSubcategoryName
      );
      if (
        !draftCategoryId ||
        draftCategoryId === PERSONAL_OVERRIDE_ID.toString()
      ) {
        // either this is a personal postcard, or there is no categoryId and we assume it is
        const draftLayout = await getItemAsync(Storage.DraftLayout);
        const draft: Draft = {
          type: MailTypes.Postcard,
          recipientId: parseInt(draftRecipientId, 10),
          content: draftContent || '',
          design: {
            image: { uri: '' },
            layout: draftLayout ? JSON.parse(draftLayout) : undefined,
            custom: true,
            categoryId: PERSONAL_OVERRIDE_ID,
          },
        };
        store.dispatch(setComposing(draft));
        return draft;
      }
      const subcategories = await getSubcategoriesById(
        parseInt(draftCategoryId, 10)
      );
      if (!draftSubcategoryName) {
        [draftSubcategoryName] = Object.keys(subcategories);
      }
      let findDesign = subcategories[draftSubcategoryName].find(
        (testDesign: PostcardDesign) => testDesign.image.uri === draftDesignUri
      );
      if (!findDesign) {
        [findDesign] = subcategories[draftSubcategoryName];
      }
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
      images: [],
    };
    store.dispatch(setComposing(draft));
    return draft;
  } catch (err) {
    Sentry.captureException(err);
    await deleteDraft();
    const draft: Draft = {
      type: MailTypes.Letter,
      recipientId: -1,
      content: '',
      images: [],
    };
    store.dispatch(setComposing(draft));
    return draft;
  }
}

interface FamilyConnectionRaw {
  contact_first_name: string;
  contact_last_name: string;
  contact_image: string;
  user_first_name: string;
  user_last_name: string;
  user_image: string;
  city: string;
  state: string;
}

interface RawReferral {
  families: FamilyConnectionRaw[];
  num_referrals: number;
  num_lives_impacted: number;
  num_mail_sent: number;
}

function cleanFamilyConnectionInfo(
  families: FamilyConnectionRaw[]
): FamilyConnection[] {
  return families.map((family) => ({
    contactImage: family.contact_image,
    contactFirstName: family.contact_first_name,
    contactLastName: family.contact_last_name,
    userImage: family.user_image,
    userFirstName: family.user_first_name,
    userLastName: family.user_last_name,
    city: family.city,
    state: family.state,
  }));
}

function cleanReferralInfo(data: RawReferral): UserReferralsInfo {
  return {
    families: cleanFamilyConnectionInfo(data.families),
    numReferrals: data.num_referrals,
    numLivesImpacted: data.num_lives_impacted,
    numMailSent: data.num_mail_sent,
  };
}

export async function getUserReferrals(): Promise<UserReferralsInfo> {
  const body = await fetchAuthenticated(
    url.resolve(API_URL, `user/${store.getState().user.user.id}/referrals`)
  );
  if (body.status !== 'OK' || !body.data) throw body;

  const data = body.data as RawReferral;
  const referrals = cleanReferralInfo(data);
  store.dispatch(setUserReferrals(referrals));
  return referrals;
}

export async function uploadPushToken(token: string): Promise<void> {
  if (!token.length) {
    const err: ApiResponse = {
      status: 'ERROR',
      date: new Date().valueOf(),
      data: 'Null push token',
    };
    throw err;
  }
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
  store.dispatch(setLoadingStatus(0));
  try {
    const rememberToken = await getItemAsync(Storage.RememberToken);
    if (!rememberToken) {
      throw Error('Cannot load token');
    }
    store.dispatch(setLoadingStatus(10));
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
    store.dispatch(setLoadingStatus(40));
    const body = await response.json();
    store.dispatch(setLoadingStatus(50));
    if (body.status !== 'OK') throw body;
    const userData = cleanUser(body.data as RawUser);
    Segment.identify(userData.email);
    Segment.track('Login Success');
    store.dispatch(authenticateUser(userData, body.data.token, rememberToken));
    getCategories().catch((err) => {
      Sentry.captureException(err);
    });
    getUserReferrals().catch((err) => {
      dropdownError({ message: i18n.t('Error.cantRefreshCategories') });
      Sentry.captureException(err);
    });
    store.dispatch(setLoadingStatus(60));
    try {
      const contacts = await getContacts();
      initMail(contacts).catch((err) => {
        Sentry.captureException(err);
      });
    } catch (err) {
      Sentry.captureException(err);
      dropdownError({ message: i18n.t('Error.loadingUser') });
      store.dispatch(logoutUser());
    }
    store.dispatch(setLoadingStatus(100));
    sleep(300).then(() => {
      store.dispatch(loginUser(userData));
    });
    loadDraft();
    getPushToken()
      .then((pushToken) => {
        uploadPushToken(pushToken).catch(() => {
          dropdownError({ message: i18n.t('Permission.notifs') });
        });
      })
      .catch((err) => {
        Sentry.captureException(err);
      });
    return userData;
  } catch (err) {
    Sentry.captureException(err);
    store.dispatch(logoutUser());
    throw Error(err);
  }
}

export async function login(cred: UserLoginInfo): Promise<User> {
  store.dispatch(setLoadingStatus(0));
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
  const userData = cleanUser(body.data as RawUser);
  store.dispatch(
    authenticateUser(userData, body.data.token, body.data.remember)
  );
  store.dispatch(setLoadingStatus(30));
  if (cred.remember) {
    saveToken(body.data.remember).catch((err) => {
      Sentry.captureException(err);
      dropdownError({
        message: i18n.t('Error.unsavedToken'),
      });
    });
  }
  store.dispatch(setLoadingStatus(50));
  Segment.identify(userData.email);
  Segment.track('Login Success');
  getCategories().catch((err) => {
    dropdownError({ message: i18n.t('Error.cantRefreshCategories') });
    Sentry.captureException(err);
  });
  getUserReferrals().catch((err) => {
    Sentry.captureException(err);
  });
  loadDraft();
  store.dispatch(setLoadingStatus(60));
  try {
    const contacts = await getContacts();
    initMail(contacts).catch((err) => {
      Sentry.captureException(err);
    });
  } catch (err) {
    Sentry.captureException(err);
    dropdownError({ message: i18n.t('Error.loadingUser') });
    store.dispatch(logoutUser());
  }
  store.dispatch(setLoadingStatus(100));
  sleep(300).then(() => {
    store.dispatch(loginUser(userData));
  });
  getPushToken()
    .then((pushToken) => {
      uploadPushToken(pushToken).catch(() => {
        dropdownError({ message: i18n.t('Permission.notifs') });
      });
    })
    .catch((err) => {
      Sentry.captureException(err);
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
      Sentry.captureException(err);
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
      Sentry.captureException(err);
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
      Sentry.captureException(err);
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
