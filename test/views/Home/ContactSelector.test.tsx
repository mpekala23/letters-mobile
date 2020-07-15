import * as React from 'react';
import { ContactSelectorScreen } from '@views';
import { render, toJSON, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { LetterTypes, LetterStatus } from 'types';

const mockStore = configureStore([]);

const setup = (contactsOverrides = [], lettersOverrides = []) => {
  const navigation = { navigate: jest.fn(), addListener: jest.fn() };
  const contacts = Object.assign(
    [
      {
        state: 'Minnesota',
        firstName: 'First',
        lastName: 'Last',
        inmateNumber: '6',
        relationship: 'Brother',
      },
    ],
    contactsOverrides
  );

  const letters = {
    type: LetterTypes.Postcard,
    status: LetterStatus.Printed,
    isDraft: true,
    recipientId: 8,
    content: "I'm trying out this new service called Ameelio...",
    ...lettersOverrides,
  };

  const initialContactState = {
    adding: {},
    existing: contacts,
  };

  const initialLetterState = {
    composing: {},
    existing: letters,
  };

  const store = mockStore({
    contact: initialContactState,
    letter: initialLetterState,
  });

  const StoreProvider = ({ children }: { children: JSX.Element }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    navigation,
    store,
    ...render(
      <ContactSelectorScreen
        navigation={navigation}
        contactState={initialContactState}
        letterState={initialLetterState}
      />,
      {
        wrapper: StoreProvider,
      }
    ),
  };
};

describe('Contact Selector Screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should load values for contact cards from the redux store', () => {
    const { getByText } = setup([
      {
        state: 'Minnesota',
        firstName: 'First Contact',
        lastName: 'Contact Last Name',
        inmateNumber: '12345678',
        relationship: 'Brother',
      },
      {
        state: 'Minnesota',
        firstName: 'Second Contact',
        lastName: 'Second Contact Last Name',
        inmateNumber: '12345678',
        relationship: 'Brother',
      },
    ]);
    expect(getByText('First Contact').props.children).toBe('First Contact');
    expect(getByText('Second Contact').props.children).toBe('Second Contact');
  });

  it('should navigate to contact info screen when the plus button is pressed', () => {
    const { navigation, getByTestId } = setup();
    fireEvent.press(getByTestId('addContact'));
    expect(navigation.navigate).toHaveBeenCalledWith('ContactInfo', {
      addFromSelector: true,
    });
  });
});
