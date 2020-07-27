import React from 'react';
import Topbar, {
  topbarRef,
  setProfile,
  setProfileOverride,
} from '@components/Topbar/Topbar.react';
import { render, toJSON, fireEvent, act } from '@testing-library/react-native';
import { sleep } from '@utils';

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
      <Topbar
        userState={{ user, authInfo }}
        navigation={navigation}
        ref={topbarRef}
      />
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
      { photo: { uri: 'placeholder' } }
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

  it('should implement profileOverride enabled buttons', () => {
    const { getByText } = setup();
    const dummy = jest.fn();
    act(() => {
      setProfile(false);
      setProfileOverride({
        enabled: true,
        text: 'press me',
        action: dummy,
      });
    });
    expect(getByText('press me')).toBeDefined();
    fireEvent.press(getByText('press me'));
    expect(dummy).toHaveBeenCalledTimes(1);
  });

  it('should implement profileOverride disabled buttons', () => {
    const { getByText } = setup();
    const dummy = jest.fn();
    act(() => {
      setProfile(false);
      setProfileOverride({
        enabled: false,
        text: 'press me',
        action: dummy,
      });
    });
    expect(getByText('press me')).toBeDefined();
    fireEvent.press(getByText('press me'));
    expect(dummy).toHaveBeenCalledTimes(0);
  });

  it('should implement profileOverride blocking buttons', async () => {
    jest.useRealTimers();
    const { getByText, getByTestId } = setup();
    act(() => {
      setProfile(false);
      setProfileOverride({
        enabled: true,
        text: 'press me',
        action: async () => {
          await sleep(100);
        },
        blocking: true,
      });
    });
    expect(getByText('press me')).toBeDefined();
    fireEvent.press(getByText('press me'));
    expect(getByTestId('loading')).toBeDefined();
    await sleep(100);
  });
});
