import * as React from 'react';
import { MemoryLaneScreen } from '@views';
import { render, toJSON, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { LetterTypes, LetterStatus } from '../../src/types';

const mockStore = configureStore([]);

const setup = (letterOverrides = [], contactOverrides = []) => {
  const navigation = { navigate: jest.fn(), addListener: jest.fn() };
  const contact = {
    id: 8,
    state: 'Minnesota',
    firstName: 'First',
    lastName: 'Last',
    inmateNumber: '6',
    relationship: 'Brother',
    ...contactOverrides,
  };
  const letters = {
    8: [
      {
        letterId: 1,
        type: LetterTypes.Postcard,
        status: LetterStatus.Delivered,
        isDraft: true,
        recipientId: 8,
        content: "I'm trying out this new service called Ameelio...",
        photo: {
          uri:
            'https://reactnativecode.com/wp-content/uploads/2017/05/react_thumb_install.png',
        },
      },
      ...letterOverrides,
    ],
  };

  const initialContact = {
    active: contact,
  };

  const store = mockStore({
    contact: initialContact,
    letter: {
      existing: letters,
    },
  });

  const StoreProvider = ({ children }: { children: JSX.Element }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    navigation,
    store,
    ...render(
      <MemoryLaneScreen
        navigation={navigation}
        contact={initialContact}
        existingLetters={letters}
      />,
      {
        wrapper: StoreProvider,
      }
    ),
  };
};

describe('Memory Lane Screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should load values for letters from the redux store', () => {
    const { getByText } = setup([
      {
        letterId: 2,
        recipientId: 8,
        content: 'Redux Letter 1',
      },
    ]);
    expect(getByText('Redux Letter 1').props.children).toBe('Redux Letter 1');
  });

  it('should navigate to letter details screen when letter card is pressed', () => {
    const { navigation, getByTestId } = setup();
    fireEvent.press(getByTestId('memoryLaneCard'));
    expect(navigation.navigate).toHaveBeenCalledWith('LetterDetails');
  });
});
