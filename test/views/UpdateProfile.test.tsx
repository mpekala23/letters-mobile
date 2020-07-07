import * as React from 'react';
import { UpdateProfileScreen } from '@views';
import { render, toJSON, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { updateProfile, logout } from '@api';

const mockStore = configureStore([]);

jest.mock('@api', () => ({
  updateProfile: jest.fn(),
  logout: jest.fn(),
}));

const setup = (authOverrides = {}, userOverrides = {}) => {
  const navigation = { navigate: jest.fn(), addListener: jest.fn() };
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
  const initialUserState = {
    user: {
      authInfo,
      user,
    },
  };
  const store = mockStore({
    user: {
      authInfo,
      user,
    },
  });

  const StoreProvider = ({ children }: { children: JSX.Element }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    navigation,
    store,
    ...render(
      <UpdateProfileScreen
        navigation={navigation}
        userState={initialUserState}
      />,
      {
        wrapper: StoreProvider,
      }
    ),
  };
};

describe('Update Profile Screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should load initial values for fields from the redux store', () => {
    const { getByPlaceholderText } = setup(
      {
        isLoadingToken: true,
        isLoggedIn: false,
        apiToken: '',
      },
      {
        id: '6',
        firstName: 'First test',
        lastName: 'Last test',
      }
    );
    expect(getByPlaceholderText('First name').props.value).toBe('First test');
    expect(getByPlaceholderText('Last name').props.value).toBe('Last test');
  });

  it('enable api call from save profile button when at least one field changes', () => {
    const { getByPlaceholderText, getByText } = setup();
    const saveButton = getByText('Save');
    fireEvent.press(saveButton);
    expect(updateProfile).toHaveBeenCalledTimes(0);
    fireEvent.changeText(getByPlaceholderText('First name'), '');
    fireEvent.changeText(getByPlaceholderText('First name'), 'Doe');
    fireEvent.press(saveButton);
    expect(updateProfile).toHaveBeenCalledTimes(1);
  });

  it('should make an api call when logout button is pressed', () => {
    const { getByText } = setup();
    fireEvent.press(getByText('Log out'));
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
