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
});
