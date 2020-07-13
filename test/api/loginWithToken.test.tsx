import { loginWithToken } from '@api';
import fetchMock from 'fetch-mock';

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest
    .fn()
    .mockReturnValueOnce(undefined)
    .mockReturnValueOnce('invalid token')
    .mockReturnValueOnce('dummy token'),
}));

describe('api loginWithToken', () => {
  it('should throw an error when there is no token', async () => {
    let error = false;
    try {
      await loginWithToken();
    } catch (err) {
      error = true;
    }
    expect(error).toBeTruthy();
  });

  it('should throw an error when there is an invalid token', async () => {
    let error = false;
    fetchMock.post(
      `*`,
      JSON.stringify({ status: 'ERROR', message: 'Invalid token', data: [] }),
      { repeat: 1 }
    );
    try {
      await loginWithToken();
    } catch (err) {
      error = true;
    }
    expect(error).toBeTruthy();
  });

  it('should return user data when good token', async () => {
    let result = null;
    let error = false;
    fetchMock.post(
      `*`,
      JSON.stringify({
        status: 'OK',
        data: {
          id: '6',
          first_name: 'Team',
          last_name: 'Ameelio',
          email: 'team@ameelio.org',
          phone: '4324324432',
          addr_line_1: 'Somewhere',
          country: 'USA',
          postal: '12345',
          city: 'New Haven',
          state: 'CT',
          token: 'dummy token',
        },
      }),
      { overwriteRoutes: false }
    );
    try {
      result = await loginWithToken();
    } catch (err) {
      error = true;
    }
    expect(result).toEqual({
      id: '6',
      firstName: 'Team',
      lastName: 'Ameelio',
      email: 'team@ameelio.org',
      phone: '4324324432',
      address1: 'Somewhere',
      address2: undefined,
      country: 'USA',
      postal: '12345',
      city: 'New Haven',
      state: 'Connecticut',
      photo: {
        type: 'image/jpeg',
        uri: undefined,
      },
    });
    expect(error).toBeFalsy();
  });
});
