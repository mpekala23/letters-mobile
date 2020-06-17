import React from 'react';
import { Topbar } from '@components';
import { render, toJSON } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

const setup = (authOverrides = {}, userOverrides = {}) => {
  const authInfo = {
    isLoadingToken: true,
    isLoggedIn: false,
    userToken: '',
    ...authOverrides,
  };
  const user = {
    id: '6',
    firstName: 'Team',
    lastName: 'Ameelio',
    email: 'team@ameelio.org',
    cell: '4324324432',
    address1: 'Somewhere',
    country: 'USA',
    zipcode: '12345',
    city: 'New Haven',
    state: 'CT',
    ...userOverrides,
  };
  const store = mockStore({
    user: {
      authInfo,
      user,
    },
  });

  const StoreProvider = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    ...render(<Topbar />, { wrapper: StoreProvider }),
  };
};

describe('Topbar component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });
});
