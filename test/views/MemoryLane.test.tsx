import * as React from 'react';
import { MemoryLaneScreen } from '@views';
import { render, toJSON } from '@testing-library/react-native';
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
        type: LetterTypes.PostCards,
        status: LetterStatus.Printed,
        isDraft: true,
        recipientId: 8,
        message: "I'm trying out this new service called Ameelio...",
        photoPath:
          'https://reactnativecode.com/wp-content/uploads/2017/05/react_thumb_install.png',
        ...letterOverrides,
      },
    ],
  };

  const initialContact = {
    active: contact,
  };

  const initialLetters = {
    existing: letters,
  };

  const store = mockStore({
    contact: initialContact,
    letter: initialLetters,
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
        letters={initialLetters}
      />,
      {
        wrapper: StoreProvider,
      }
    ),
  };
};

describe('Memory Lane Screen', () => {
  it('should match snapshot', () => {
    const { container } = setup(<MemoryLaneScreen />);
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should load values for letters from the redux store', () => {
    const { getByText } = setup({
      letterId: 2,
      recipientId: 8,
      message: 'Redux Letter 1',
    });
    expect(getByText('Redux Letter 1').props.children).toBe('Redux Letter 1');
  });

  // TO-DO: Test navigation to letter info screen when card is pressed
});
