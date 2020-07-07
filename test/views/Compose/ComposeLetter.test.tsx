import React from 'react';
import { ComposeLetterScreen } from '@views';
import { render, toJSON, fireEvent } from '@testing-library/react-native';
import { LetterTypes, LetterStatus } from 'types';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import i18n from '@i18n';

const mockStore = configureStore([]);

const setup = () => {
  const navigation = { navigate: jest.fn(), addListener: jest.fn() };

  const store = mockStore({
    letter: {
      composing: {
        type: LetterTypes.Letters,
        status: LetterStatus.Draft,
        isDraft: true,
        recipientId: -1,
        recipientName: '',
        message: '',
        photoPath: '',
        letterId: -1,
      },
    },
  });

  const StoreProvider = ({ children }: { children: JSX.Element }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    navigation,
    store,
    ...render(<ComposeLetterScreen navigation={navigation} />, {
      wrapper: StoreProvider,
    }),
  };
};

describe('ComposeLetter screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should update the redux store when the message changes', () => {
    const { getByPlaceholderText, store } = setup();
    const input = getByPlaceholderText(i18n.t('Compose.placeholder'));
    fireEvent.changeText(input, 'new text');
    expect(store.getActions()[1].type).toBe('letter/set_message');
    expect(store.getActions()[1].payload).toBe('new text');
  });

  it('should update words left correctly', () => {
    const { getByPlaceholderText, getByText } = setup();
    const input = getByPlaceholderText(i18n.t('Compose.placeholder'));
    fireEvent.changeText(input, 'two words');
    expect(getByText('298 left')).toBeDefined();
  });

  // TODO: Once new navbar is done, add next / back navigation test
});
