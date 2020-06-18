import * as React from 'react';
import { ReviewContactScreen } from '@views';
import { render, toJSON, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { addContact } from '@api';

const mockStore = configureStore([]);

jest.mock('@api', () => ({
  addContact: jest.fn(),
}));

const setup = (contactOverrides = {}) => {
  const navigation = { navigate: jest.fn(), addListener: jest.fn() };
  const contact = {
    state: 'Minnesota',
    firstName: 'First',
    lastName: 'Last',
    inmateNumber: '6',
    relationship: 'Brother',
    facility: {
      address: 'Address',
      city: 'City',
      name: 'Facility Name',
      postal: '23232',
      state: 'MN',
      type: 'State Prison',
    },
    ...contactOverrides,
  };
  const initialState = {
    adding: contact,
    existing: [],
  };
  const store = mockStore({
    contact: initialState,
  });

  const StoreProvider = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    navigation,
    store,
    ...render(
      <ReviewContactScreen
        navigation={navigation}
        contactState={initialState}
      />,
      {
        wrapper: StoreProvider,
      }
    ),
  };
};

describe('Review Contact Screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should have add contact button be enabled only when all fields are valid', () => {
    const { navigation, getByPlaceholderText, getByText } = setup();
    const addButton = getByText('Add Contact');
    expect(addButton.parentNode.props.style[1]).toEqual({});
    fireEvent.changeText(getByPlaceholderText('State'), '');
    expect(addButton.parentNode.props.style[1].backgroundColor).toBeDefined();
    fireEvent.changeText(getByPlaceholderText('State'), 'Minnesota');
    fireEvent.changeText(getByPlaceholderText('First Name'), '');
    expect(addButton.parentNode.props.style[1].backgroundColor).toBeDefined();
    fireEvent.changeText(getByPlaceholderText('First Name'), 'First name');
    fireEvent.changeText(getByPlaceholderText('Last Name'), '');
    expect(addButton.parentNode.props.style[1].backgroundColor).toBeDefined();
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Last name');
    fireEvent.changeText(getByPlaceholderText('Postal'), '213');
    expect(addButton.parentNode.props.style[1].backgroundColor).toBeDefined();
    fireEvent.changeText(getByPlaceholderText('Postal'), '21389');
    fireEvent.changeText(getByPlaceholderText('Facility Name'), '');
    expect(addButton.parentNode.props.style[1].backgroundColor).toBeDefined();
    fireEvent.changeText(getByPlaceholderText('Facility Name'), 'A facility');
    fireEvent.changeText(getByPlaceholderText('Facility Address'), '');
    expect(addButton.parentNode.props.style[1].backgroundColor).toBeDefined();
    fireEvent.changeText(
      getByPlaceholderText('Facility Address'),
      'An address'
    );
    // now all fields are valid again, should be enabled
    expect(addButton.parentNode.props.style[1]).toEqual({});
  });

  it('should load initial values for fields from the redux store', () => {
    const { getByPlaceholderText } = setup({
      state: 'Minnesota',
      firstName: 'First test',
      lastName: 'Last test',
      inmateNumber: '8',
      relationship: 'Brother',
    });
    expect(getByPlaceholderText('State').props.value).toBe('Minnesota');
    expect(getByPlaceholderText('First Name').props.value).toBe('First test');
    expect(getByPlaceholderText('Last Name').props.value).toBe('Last test');
  });

  it('should navigate to the facility directory screen when the back button is pressed', () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('Back'));
    expect(navigation.navigate).toHaveBeenCalledWith('FacilityDirectory');
  });

  it('should make an api call when add contact button is pressed', () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText('Add Contact'));
    expect(addContact).toHaveBeenCalledTimes(1);
  });
});
