import store from '@store';
import { Linking } from 'react-native';
import { loginUser, logoutUser } from '@store/User/UserActions';
import { User, UserCredentials, UserInfo } from '@store/User/UserTypes';
import url from 'url';

const { MOCK_API_IP } = process.env;

export const API_URL = `http://${MOCK_API_IP}:9000/api/`;

export interface UserResponse {
  type: string;
  data: User;
}

export function fetchTimeout<T>(
  fetchUrl: string,
  options: Record<string, unknown>,
  timeout = 3000
): Promise<Response | T> {
  return Promise.race([
    fetch(fetchUrl, options),
    new Promise<Response | T>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), timeout)
    ),
  ]);
}

/** Dummy function atm, once I implement persistent storage I will replace. */
export function loadToken(): void {
  const dummyData: User = {
    id: '6',
    firstName: 'Team',
    lastName: 'Ameelio',
    email: 'team@ameelio.org',
    phone: '4324324432',
    address1: 'Somewhere',
    country: 'USA',
    postal: '12345',
    city: 'New Haven',
    state: 'CT',
  };
  store.dispatch(loginUser(dummyData));
}

/** Dummy function atm, once I implement mock login API calls (and then real calls) I will replace */
export async function login(cred: UserCredentials): Promise<User> {
  const response = await fetchTimeout<Response>(url.resolve(API_URL, 'login'), {
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
  if (body.type === 'error') {
    throw Error(body.data);
  }
  const userData: User = {
    id: body.data.id,
    firstName: body.data.firstName,
    lastName: body.data.lastName,
    email: body.data.email,
    phone: body.data.cell,
    address1: body.data.address1,
    address2: body.data.address2 || null,
    country: body.data.country,
    postal: body.data.zipCode,
    city: body.data.city,
    state: body.data.state,
  };
  store.dispatch(loginUser(userData));
  return userData;
}

export async function register(data: UserInfo): Promise<User> {
  const response = await fetchTimeout<Response>(
    url.resolve(API_URL, 'register'),
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }
  );
  const body = await response.json();
  if (body.type === 'error') {
    throw Error(body.data);
  }
  const userData: User = {
    id: body.data.id,
    firstName: body.data.firstName,
    lastName: body.data.lastName,
    email: body.data.email,
    phone: body.data.cell,
    address1: body.data.address1,
    address2: body.data.address2 || null,
    country: body.data.country,
    postal: body.data.zipcode,
    city: body.data.city,
    state: body.data.state,
  };
  store.dispatch(loginUser(userData));
  return userData;
}

export async function facebookShare(shareUrl: string): Promise<void> {
  const supportedUrl = await Linking.canOpenURL(shareUrl);
  if (supportedUrl) {
    await Linking.openURL(shareUrl);
  } else {
    throw Error('Share Url not supported');
  }
}
