import React from 'react';
import { FirstLetterScreen } from '@views';
import { render, fireEvent, toJSON } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

const setup = () => {
  const navigation = { navigate: jest.fn() };
  const store = mockStore({
    notif: {
      currentNotif: null,
      pastNotifs: [],
      futureNotifs: [],
    },
  });
  const StoreProvider = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    navigation,
    ...render(<FirstLetterScreen navigation={navigation} />, {
      wrapper: StoreProvider,
    }),
  };
};

describe('First Letter screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should navigate to home screen when it was fire button is pressed', async () => {
    const { navigation, getByText } = setup();
    const fireButton = getByText('It was fire');
    fireEvent.press(fireButton);
    expect(navigation.navigate).toHaveBeenCalledWith('Home');
  });

  it('should navigate to issues screen when problem button is pressed', async () => {
    const { navigation, getByText } = setup();
    const problemButton = getByText('Something went wrong');
    fireEvent.press(problemButton);
    expect(navigation.navigate).toHaveBeenCalledWith('Issues');
  });
});
