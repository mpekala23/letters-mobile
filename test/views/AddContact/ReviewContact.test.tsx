import * as React from 'react';
import { ReviewContactScreen } from '@views';
import { render, toJSON, fireEvent, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { addContact } from '@api';
import { sleep } from '@utils';

const mockStore = configureStore([]);

jest.mock('@api', () => ({
  addContact: jest.fn(),
}));

const setup = (contactOverrides = {}) => {
  const navigation = { navigate: jest.fn(), addListener: jest.fn() };
  const contact = {
    firstName: 'First',
    lastName: 'Last',
    inmateNumber: '6',
    relationship: 'Brother',
    facility: {
      address: 'Address',
      city: 'City',
      name: 'Facility Name',
      postal: '23232',
      state: 'Minnesota',
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
    letter: {
      existing: {},
    },
  });

  const StoreProvider = ({ children }: { children: JSX.Element }) => {
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
    const { getByPlaceholderText, getByText } = setup();
    const nextButton = getByText('Add Contact');
    expect(nextButton.parentNode.props.style[1]).toEqual({});
    fireEvent.changeText(getByPlaceholderText('State'), '');
    expect(nextButton.parentNode.props.style[1].backgroundColor).toBeDefined();
    fireEvent.changeText(getByPlaceholderText('State'), 'Minnesota');
    fireEvent.changeText(getByPlaceholderText('First Name'), '');
    expect(nextButton.parentNode.props.style[1].backgroundColor).toBeDefined();
    fireEvent.changeText(getByPlaceholderText('First Name'), 'First name');
    fireEvent.changeText(getByPlaceholderText('Last Name'), '');
    expect(nextButton.parentNode.props.style[1].backgroundColor).toBeDefined();
    fireEvent.changeText(getByPlaceholderText('Last Name'), 'Last name');
    fireEvent.changeText(getByPlaceholderText('Postal'), '213');
    expect(nextButton.parentNode.props.style[1].backgroundColor).toBeDefined();
    fireEvent.changeText(getByPlaceholderText('Postal'), '21389');
    fireEvent.changeText(getByPlaceholderText('Facility Name'), '');
    expect(nextButton.parentNode.props.style[1].backgroundColor).toBeDefined();
    fireEvent.changeText(getByPlaceholderText('Facility Name'), 'A facility');
    fireEvent.changeText(getByPlaceholderText('Facility Address'), '');
    expect(nextButton.parentNode.props.style[1].backgroundColor).toBeDefined();
    fireEvent.changeText(
      getByPlaceholderText('Facility Address'),
      'An address'
    );
    // now all fields are valid again, should be enabled
    expect(nextButton.parentNode.props.style[1]).toEqual({});
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

  it('should make an api call when add contact button is pressed', async () => {
    jest.useRealTimers();
    const { getByText } = setup();
    await act(async () => {
      fireEvent.press(getByText('Add Contact'));
      await sleep(10);
    });
    expect(addContact).toHaveBeenCalledTimes(1);
  });
});
