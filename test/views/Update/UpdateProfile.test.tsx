import * as React from 'react';
import { UpdateProfileScreen } from '@views';
import { render, toJSON, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { logout } from '@api';

const mockStore = configureStore([]);

jest.mock('@api', () => ({
  logout: jest.fn(),
}));

const setup = (authOverrides = {}, userOverrides = {}) => {
  const navigation = { navigate: jest.fn(), addListener: jest.fn() };
  const authInfo = {
    isLoadingToken: false,
    isLoggedIn: true,
    apiToken: 'dummy',
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
    joined: new Date(6),
    ...userOverrides,
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
    ...render(<UpdateProfileScreen navigation={navigation} />, {
      wrapper: StoreProvider,
    }),
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
      {},
      {
        id: '6',
        firstName: 'First test',
        lastName: 'Last test',
      }
    );
    expect(getByPlaceholderText('First name').props.value).toBe('First test');
    expect(getByPlaceholderText('Last name').props.value).toBe('Last test');
  });

  it('should make an api call when logout button is pressed', () => {
    const { getByText } = setup();
    fireEvent.press(getByText('Log out'));
    expect(logout).toHaveBeenCalledTimes(1);
  });
});
