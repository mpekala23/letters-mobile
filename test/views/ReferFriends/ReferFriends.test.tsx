import React from 'react';
import { render, fireEvent, toJSON } from '@testing-library/react-native';
import { ReferFriendsScreen } from '@views';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { facebookShare } from '@api';

const mockStore = configureStore([]);

jest.mock('@api', () => ({
  facebookShare: jest.fn(),
}));

const setup = (contactOverrides = []) => {
  const navigation = { navigate: jest.fn() };
  const contact = {
    firstName: 'First',
    lastName: 'Last',
    inmateNumber: '6',
    relationship: 'Brother',
    ...contactOverrides,
  };

  const initialContactState = {
    active: contact,
  };

  const store = mockStore({
    contact: initialContactState,
  });

  const StoreProvider = ({ children }: { children: JSX.Element }) => {
    return <Provider store={store}>{children}</Provider>;
  };
  return {
    navigation,
    store,
    ...render(
      <ReferFriendsScreen
        navigation={navigation}
        contactState={initialContactState}
      />,
      {
        wrapper: StoreProvider,
      }
    ),
  };
};

describe('ReferFriends screen', () => {
  // it('should match snapshot', () => {
  //   const { container } = setup();
  //   const tree = toJSON(container);
  //   expect(tree).toMatchSnapshot();
  // });

  it('should return to SingleContact screen when done is pressed', async () => {
    const { navigation, getByText } = setup();
    const doneButton = getByText('Done');
    fireEvent.press(doneButton);
    expect(navigation.navigate).toHaveBeenCalledWith('SingleContact');
  });

  it('should make api call on share press', async () => {
    const { getByText } = setup();
    const shareUrl =
      'https://www.facebook.com/sharer/sharer.php?u=letters.ameelio.org';
    const shareButton = getByText('Share on Facebook');
    fireEvent.press(shareButton);
    expect(facebookShare).toHaveBeenCalledWith(shareUrl);
  });
});
