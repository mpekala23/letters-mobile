import React from 'react';
import { ChooseOptionScreen } from '@views';
import { render, fireEvent, toJSON } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { LetterTypes } from 'types';
import { popupAlert } from '@components/Alert/Alert.react';

jest.mock('@components/Alert/Alert.react', () => ({
  popupAlert: jest.fn(),
}));

const mockStore = configureStore([]);

const setup = (composingOverride = {}) => {
  const navigation = { navigate: jest.fn() };
  const store = mockStore({
    letter: {
      composing: {
        ...{
          type: LetterTypes.Postcard,
          recipient: null,
          content: '',
        },
        ...composingOverride,
      },
      existing: [],
    },
    user: {
      user: {
        address1: 'Somewhere',
        address2: 'Apt A',
        city: 'Springfield',
        state: 'Illinois',
        postal: '90210',
      },
    },
    contact: {
      active: {
        id: 1,
      },
    },
  });
  const StoreProvider = ({ children }: { children: JSX.Element }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    navigation,
    store,
    ...render(<ChooseOptionScreen navigation={navigation} />, {
      wrapper: StoreProvider,
    }),
  };
};

describe('ChooseOption screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should dispatch a setType action when Photos button is pressed', () => {
    const { store, getByText } = setup();
    fireEvent.press(getByText('Photos'));
    const actions = store.getActions();
    expect(actions.length).toBe(2);
    expect(actions[0].type).toBe('letter/set_type');
    expect(actions[0].payload).toBe('postcard');
  });

  it('should dispatch a setType action when Letter button is pressed', () => {
    const { store, getByText } = setup();
    fireEvent.press(getByText('Letters'));
    const actions = store.getActions();
    expect(actions.length).toBe(2);
    expect(actions[0].type).toBe('letter/set_type');
    expect(actions[0].payload).toBe('letter');
  });

  it('should show an alert after pressing Letters when draft exists with content', () => {
    const { getByText } = setup({ content: 'non-empty' });
    fireEvent.press(getByText('Letters'));
    expect(popupAlert).toHaveBeenCalled();
  });

  it('should show an alert after pressing Photos when draft exists with content', () => {
    const { getByText } = setup({ content: 'non-empty' });
    fireEvent.press(getByText('Photos'));
    expect(popupAlert).toHaveBeenCalled();
  });

  it('should show an alert after pressing Letters when draft exists with photo', () => {
    const { getByText } = setup({ photo: { uri: 'dummy' } });
    fireEvent.press(getByText('Letters'));
    expect(popupAlert).toHaveBeenCalled();
  });

  it('should show an alert after pressing Photos when draft exists with photo', () => {
    const { getByText } = setup({ photo: { uri: 'dummy' } });
    fireEvent.press(getByText('Photos'));
    expect(popupAlert).toHaveBeenCalled();
  });
});
