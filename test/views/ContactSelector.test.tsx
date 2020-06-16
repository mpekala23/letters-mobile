import * as React from 'react';
import { ContactSelectorScreen } from '@views';
import { render, toJSON, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

const setup = (contactsOverrides = []) => {
  const navigation = { navigate: jest.fn(), addListener: jest.fn() };
  const contacts = Object.assign(
    [
      {
        state: 'Minnesota',
        first_name: 'First',
        last_name: 'Last',
        inmate_number: '6',
        relationship: 'Brother',
      },
    ],
    contactsOverrides
  );

  const initialState = {
    adding: {},
    existing: contacts,
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
    const { getByText } = setup([
      {
        state: 'Minnesota',
        first_name: 'First Contact',
        last_name: 'Contact Last Name',
        inmate_number: '12345678',
        relationship: 'Brother',
      },
      {
        state: 'Minnesota',
        first_name: 'Second Contact',
        last_name: 'Second Contact Last Name',
        inmate_number: '12345678',
        relationship: 'Brother',
      },
    ]);
    expect(getByText('First Contact').props.children).toBe('First Contact');
    expect(getByText('Second Contact').props.children).toBe('Second Contact');
  });

  it('should navigate to contact info screen when the plus button is pressed', () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('+'));
    expect(navigation.navigate).toHaveBeenCalledWith('ContactInfo');
  });
});
