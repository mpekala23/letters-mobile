import * as React from 'react';
import { ContactInfoScreen } from '@views';
import { render, toJSON, fireEvent } from '@testing-library/react-native';
import { SET_ADDING } from '@store/Contact/ContactTypes';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

const mockStore = configureStore([]);

const setup = (
  contactOverrides = {},
  userOverrides = {},
  routeOverrides = {}
) => {
  const navigation = {
    navigate: jest.fn(),
    addListener: jest.fn(),
    setParams: jest.fn(),
  };
  const route = {
    params: {
      addFromSelector: false,
      ...routeOverrides,
    },
  };
  const contact = {
    firstName: '',
    lastName: '',
    inmateNumber: '',
    relationship: '',
    facility: null,
    ...contactOverrides,
  };
  const user = {
    id: '6',
    firstName: 'Team',
    lastName: 'Ameelio',
    email: 'team@ameelio.org',
    cell: '4324324432',
    address1: 'Somewhere',
    zipcode: '12345',
    city: 'New Haven',
    state: 'CT',
    ...userOverrides,
  };
  const authInfo = {
    isLoadingToken: false,
    isLoggedIn: true,
  };
  const initialState = {
    adding: contact,
    existing: [],
  };
  const store = mockStore({
    contact: initialState,
    user: {
      authInfo,
      user,
    },
  });

  const StoreProvider = ({ children }: { children: JSX.Element }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    navigation,
    store,
    ...render(
      <ContactInfoScreen
        navigation={navigation}
        contactState={initialState}
        route={route}
      />,
      {
        wrapper: StoreProvider,
      }
    ),
  };
};

describe('Contact Info Screen', () => {
  it('should match snapshot', () => {
    const { container } = setup(<ContactInfoScreen />);
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should load initial values for fields from the redux store', () => {
    const { getByPlaceholderText } = setup({
      firstName: 'First',
      lastName: 'Last',
      inmateNumber: '6',
      relationship: 'Sister',
    });
    expect(getByPlaceholderText('First Name').props.value).toBe('First');
    expect(getByPlaceholderText('Last Name').props.value).toBe('Last');
    expect(getByPlaceholderText('Inmate Number').props.value).toBe('6');
    expect(getByPlaceholderText('Relationship to Inmate').props.value).toBe(
      'Sister'
    );
  });

  it('should update the state databases to search when user inputs a valid state', () => {
    const { queryAllByText, getAllByText, getByPlaceholderText } = setup();
    fireEvent.changeText(getByPlaceholderText('State'), 'Iowa');
    expect(getAllByText('Iowa')).toBeDefined();
    const stateInput = getByPlaceholderText('State');
    fireEvent.changeText(stateInput, 'Not a valid state');
    fireEvent.changeText(stateInput, 'Kansas');
    expect(queryAllByText('Iowa').length).toBeFalsy();
    expect(getAllByText('Kansas')).toBeDefined();
  });
});
