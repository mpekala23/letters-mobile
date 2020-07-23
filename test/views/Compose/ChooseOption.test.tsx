import React from 'react';
import { ChooseOptionScreen } from '@views';
import { render, fireEvent, toJSON } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { LetterTypes } from 'types';

const mockStore = configureStore([]);

const setup = () => {
  const navigation = { navigate: jest.fn() };
  const store = mockStore({
    letter: {
      composing: {
        type: LetterTypes.Postcard,
        recipient: null,
        content: '',
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

  it('should dispatch a setType action when Post cards button is pressed', () => {
    const { store, getByText } = setup();
    fireEvent.press(getByText('Post cards'));
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
});
