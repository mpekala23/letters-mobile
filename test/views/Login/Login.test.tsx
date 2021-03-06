import React from 'react';
import { LoginScreen } from '@views';
import { login } from '@api';
import { render, fireEvent, toJSON, act } from '@testing-library/react-native';
import fetchMock from 'jest-fetch-mock';
import { sleep } from '@utils';

jest.mock('@api', () => ({
  login: jest.fn(),
}));

const setup = (response = {}) => {
  const navigation = { navigate: jest.fn() };
  if (Object.keys(response).length > 0) {
    fetchMock.mockOnce(JSON.stringify(response));
  }
  return {
    navigation,
    ...render(<LoginScreen navigation={navigation} />),
  };
};

describe('Login screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should make an api call on login', async () => {
    jest.useRealTimers();
    const { getByText, getByPlaceholderText } = setup({
      data: {
        id: '6',
        firstName: 'Team',
        lastName: 'Ameelio',
        email: 'team@ameelio.org',
        phone: '4324324432',
        address1: 'Somewhere',
        postal: '12345',
        city: 'New Haven',
        state: 'CT',
      },
      status: 'OK',
    });
    act(() => {
      fireEvent.changeText(
        getByPlaceholderText('E-mail Address'),
        'team@ameelio.org'
      );
      fireEvent.changeText(getByPlaceholderText('Password'), 'ThisGood1');
    });
    await act(async () => {
      fireEvent.press(getByText('Log in'));
      await sleep(100);
    });
    expect(login).toHaveBeenCalledTimes(1);
  });

  it('should navigate to terms of service when ToS button is pressed', () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('Terms of Service'));
    expect(navigation.navigate).toHaveBeenCalledWith('Terms');
  });

  it('should navigate to privacy policy when privacy button is pressed', () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('Privacy Policy'));
    expect(navigation.navigate).toHaveBeenCalledWith('Privacy');
  });
});
