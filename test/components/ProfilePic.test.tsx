import React from 'react';
import { ProfilePic } from '@components';
import { render, toJSON } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

const setup = (propOverrides = {}, authOverrides = {}, userOverrides = {}) => {
  const props = {
    firstName: 'Team',
    lastName: 'Ameelio',
    ...propOverrides,
  };
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
    ...render(<ProfilePic {...props} />),
    props,
  };
};

describe('ProfilePic component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should display initials when a user has no profile picture', () => {
    const imageUri = '';
    const { getAllByText } = setup({ imageUri });
    expect(getAllByText('TA').length).toBe(1);
  });

  it('should show image when user has profile picture', () => {
    const imageUri = 'placeholder';
    const { getByLabelText } = setup({ imageUri });
    expect(getByLabelText('Profile Picture')).toBeDefined();
  });
});
