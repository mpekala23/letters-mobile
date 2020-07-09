import * as React from 'react';
import { LetterDetailsScreen } from '@views';
import { render, toJSON } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { LetterTypes, LetterStatus } from '../../src/types';

const mockStore = configureStore([]);

const setup = (letterOverrides = {}) => {
  const navigation = { navigate: jest.fn(), addListener: jest.fn() };
  const letter = {
    type: LetterTypes.Postcard,
    status: LetterStatus.Mailed,
    isDraft: true,
    recipientId: 8,
    content: "I'm trying out this new service called Ameelio...",
    photoPath: '',
    letterId: 1,
    expectedDeliveryDate: '2019-06-30',
    dateCreated: '06/26/2019',
    trackingEvents: [
      {
        id: 1,
        name: LetterStatus.Mailed,
        location: '20002',
        date: '2019-07-12T15:51:41.000Z',
      },
    ],
    ...letterOverrides,
  };

  const initialLetterState = {
    composing: {},
    active: letter,
    existing: [],
  };

  const store = mockStore({
    letter: initialLetterState,
  });

  const StoreProvider = ({ children }: { children: JSX.Element }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    navigation,
    store,
    ...render(<LetterDetailsScreen />, {
      wrapper: StoreProvider,
    }),
  };
};

describe('Letter Details Screen', () => {
  it('should match snapshot', () => {
    const { container } = setup(<LetterDetailsScreen />);
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should display created date', () => {
    const { getByText } = setup();
    expect(getByText('06/26/2019')).toBeDefined();
  });

  it('should display letter content', () => {
    const { getByText } = setup();
    expect(
      getByText("I'm trying out this new service called Ameelio...")
    ).toBeDefined();
  });

  it('should load values for letters from the redux store', () => {
    const { getByText } = setup({
      type: LetterTypes.Postcard,
      status: LetterStatus.InTransit,
      isDraft: true,
      recipientId: 8,
      content: 'Redux Letter 1',
      letterId: 2,
      expectedDeliveryDate: '2019-06-30',
    });
    expect(getByText('Redux Letter 1').props.children).toBe('Redux Letter 1');
  });
});
