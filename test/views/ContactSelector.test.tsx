import * as React from 'react';
import { ContactSelectorScreen } from '@views';
import { render, toJSON, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

const setup = (contactsOverrides = {}) => {
  const navigation = { navigate: jest.fn(), addListener: jest.fn() };
  const contact = {
    state: 'Minnesota',
    firstName: 'First',
    lastName: 'Last',
    inmateNumber: '6',
    relationship: 'Brother',
    facility: {
      address: 'Address',
      city: 'City',
      name: 'Facility Name',
      postal: '23232',
      state: 'MN',
      type: 'State Prison',
    },
    ...contactsOverrides,
  };
  const initialState = {
    adding: contact,
    existing: [contact],
  };
  const store = mockStore({
    contact: initialState,
  });

  const StoreProvider = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    navigation,
    store,
    ...render(<ContactSelectorScreen navigation={navigation} contactState={initialState} />, {
      wrapper: StoreProvider,
    }),
  };
};

describe('Contact Selector Screen', () => {
  it('should match snapshot', () => {
    const { container } = setup(<ContactSelectorScreen />);
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should load values for contact cards from the redux store', () => {
    const { getByText } = setup({
      state: 'Minnesota',
      firstName: 'Contact First Name',
      lastName: 'Contact Last Name',
      inmateNumber: '12345678',
      relationship: 'Brother',
    });
    expect(getByText('Contact First Name').props.children).toBe('Contact First Name');
  });

  it('should navigate to contact info screen when the plus button is pressed', () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('+'));
    expect(navigation.navigate).toHaveBeenCalledWith('ContactInfo');
  });
});
