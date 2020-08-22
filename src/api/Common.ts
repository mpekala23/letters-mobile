/* eslint-disable camelcase */
import { User } from '@store/User/UserTypes';
import store from '@store';
import url from 'url';
import {
  logoutUser,
  loginUser,
  authenticateUser,
} from '@store/User/UserActions';
import { Image, ZipcodeInfo } from 'types';
import { Platform } from 'react-native';
import { ABBREV_TO_STATE } from '@utils';
import Constants from 'expo-constants';

export const RELEASE_CHANNEL = Constants.manifest.releaseChannel;
export const GENERAL_URL =
  // RELEASE_CHANNEL && RELEASE_CHANNEL.indexOf('prod') === -1
  true
    ? 'https://api.ameelio.org/'
    : 'https://letters-api-staging.ameelio.org/';
export const API_URL =
  // RELEASE_CHANNEL && RELEASE_CHANNEL.indexOf('prod') === -1
  true
    ? 'https://api.ameelio.org/api/'
    : 'https://letters-api-staging.ameelio.org/api/';

export interface ApiResponse {
  date: number;
  status?: 'OK' | 'ERROR' | 'succeeded';
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
  timeout = 15000
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
  timeout = 15000
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
      postal: tokenBody.data.postal,
      city: tokenBody.data.city,
      state: tokenBody.data.state,
      credit: tokenBody.data.credit,
      joined: tokenBody.data.created_at,
    };
    store.dispatch(
      authenticateUser(userData, tokenBody.data.token, tokenBody.data.remember)
    );
    store.dispatch(loginUser(userData));
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

export async function uploadImage(
  image: Image,
  type: 'avatar' | 'letter'
): Promise<Image> {
  const data = new FormData();

  const photo = {
    name: store.getState().user.user.id.toString() + Date.now().toString(),
    type: 'image/jpeg',
    uri:
      Platform.OS === 'android' ? image.uri : image.uri.replace('file://', ''),
  };

  data.append('file', photo);
  data.append('type', type);

  const response = await fetchTimeout(
    url.resolve(GENERAL_URL, 'file/upload'),
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
  };
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
    lat: string;
    lng: string;
  };
  return {
    zip: data.zip,
    city: data.city,
    state: ABBREV_TO_STATE[data.state_id],
    lat: parseFloat(data.lat),
    long: parseFloat(data.lng),
  };
}
