import React from 'react';
import { Topbar } from '@components';
import { render, toJSON, fireEvent } from '@testing-library/react-native';

const setup = (authOverrides = {}, userOverrides = {}, navOverrides = {}) => {
  const authInfo = {
    isLoadingToken: true,
    isLoggedIn: false,
    apiToken: '',
    ...authOverrides,
  };
  const user = {
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
    ...userOverrides,
  };
  const navigation = {
    canGoBack: () => true,
    goBack: jest.fn(),
    ...navOverrides,
  };

  return {
    ...render(
      <Topbar userState={{ user, authInfo }} navigation={navigation} />
    ),
    user,
    authInfo,
    navigation,
  };
};

describe('Topbar component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should show a blank profile picture when user is logged out', () => {
    const { getByTestId } = setup();
    expect(getByTestId('blank').children.length).toBe(0);
  });

  it('should show an image when a user is logged in with a profile picture', () => {
    const { getByLabelText } = setup(
      {
        isLoggedIn: true,
      },
      { imageUri: 'placeholder' }
    );
    expect(getByLabelText('Profile Picture')).toBeDefined();
  });

  it('should allow a user to go back when canGoBack() returns true', () => {
    const { getByTestId, navigation } = setup();
    const backButton = getByTestId('backButton');
    fireEvent.press(backButton);
    expect(navigation.goBack).toHaveBeenCalledTimes(1);
  });

  it('should not display a back button when canGoBack() returns false', () => {
    const { queryByTestId } = setup({}, {}, { canGoBack: () => false });
    const backButton = queryByTestId('backButton');
    expect(backButton).toBeNull();
  });
});
