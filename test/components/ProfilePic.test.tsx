import React from 'react';
import { ProfilePic } from '@components';
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
    ...render(<ProfilePic />, { wrapper: StoreProvider }),
  };
};

describe('ProfilePic component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should be blank when user is logged out', () => {
    const { getByTestId } = setup();
    expect(getByTestId('blank').children.length).toBe(0);
  });

  it('should display initials when a user is logged in without a profile picture', () => {
    const { getAllByText } = setup({ isLoggedIn: true });
    expect(getAllByText('TA').length).toBe(1);
  });

  it('should show an image when a user is logged in with a profile picture', () => {
    const { getByLabelText } = setup(
      {
        isLoggedIn: true,
      },
      { imageUri: 'placeholder' }
    );
    expect(getByLabelText('ProfilePicture')).toBeDefined();
  });
});
