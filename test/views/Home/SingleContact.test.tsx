import * as React from 'react';
import { SingleContactScreen } from '@views';
import { render, toJSON, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { LetterTypes, LetterStatus } from 'types';

const mockStore = configureStore([]);

const setup = (letterOverrides = []) => {
  const navigation = { navigate: jest.fn(), addListener: jest.fn() };
  const contact = {
    state: 'Minnesota',
    firstName: 'First',
    lastName: 'Last',
    inmateNumber: '6',
    relationship: 'Brother',
  };
  const letters = Object.assign(
    [
      {
        type: LetterTypes.Postcard,
        status: LetterStatus.OutForDelivery,
        isDraft: false,
        recipientId: 8,
        content: "Hi Emily! How are you doing? I'm trying out this...",
      },
    ],
    letterOverrides
  );

  const route = {
    params: { contact, letters },
  };

  const initialLetterState = {
    existing: letters,
  };

  const store = mockStore({
    letter: initialLetterState,
  });

  const StoreProvider = ({ children }: { children: JSX.Element }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    navigation,
    route,
    store,
    ...render(<SingleContactScreen navigation={navigation} route={route} />, {
      wrapper: StoreProvider,
    }),
  };
};

describe('Single Contact Screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should load values for letters from the redux store', () => {
    const { getByText } = setup([
      {
        type: LetterTypes.Postcard,
        status: LetterStatus.OutForDelivery,
        isDraft: false,
        recipientId: 8,
        content: 'Redux Letter 1',
      },
      {
        type: LetterTypes.Postcard,
        status: LetterStatus.OutForDelivery,
        isDraft: false,
        recipientId: 8,
        content: 'Redux Letter 2',
      },
    ]);
    expect(getByText('Redux Letter 1').props.children).toBe('Redux Letter 1');
    expect(getByText('Redux Letter 2').props.children).toBe('Redux Letter 2');
  });

  it('should navigate to compose options screen when send letter button is pressed', () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('Send letter'));
    expect(navigation.navigate).toHaveBeenCalledWith('ChooseOption');
  });

  // TO-DO: Test navigation to memory lane screen when card is pressed

  it('should navigate to letter tracking screen when letter card is pressed', () => {
    const { navigation, getByTestId } = setup();
    fireEvent.press(getByTestId('letterStatusCard'));
    expect(navigation.navigate).toHaveBeenCalledWith('LetterTracking');
  });
});
