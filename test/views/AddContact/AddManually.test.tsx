import * as React from 'react';
import { AddManuallyScreen } from '@views';
import { render, toJSON, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

const setup = (contactOverrides = {}) => {
  const navigation = { navigate: jest.fn(), addListener: jest.fn() };
  const contact = {
    firstName: '',
    lastName: '',
    inmateNumber: '',
    relationship: '',
    facility: null,
    ...contactOverrides,
  };
  const initialState = {
    adding: contact,
    existing: [],
  };
  const store = mockStore({
    contact: initialState,
  });

  const StoreProvider = ({ children }: { children: JSX.Element }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    navigation,
    store,
    ...render(
      <AddManuallyScreen navigation={navigation} contactState={initialState} />,
      {
        wrapper: StoreProvider,
      }
    ),
  };
};

describe('Add Manually Screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });
});
