import * as React from 'react';
import { UpdateContactScreen } from '@views';
import { render, toJSON, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { updateContact, deleteContact } from '@api';

const mockStore = configureStore([]);

jest.mock('@api', () => ({
  updateContact: jest.fn(),
  deleteContact: jest.fn(),
}));

const setup = (contactOverrides = []) => {
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
      state: 'MN',
      type: 'State Prison',
    },
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
      <UpdateContactScreen
        navigation={navigation}
        contactState={initialContactState}
      />,
      {
        wrapper: StoreProvider,
      }
    ),
  };
};

describe('Update Contact Screen', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should load initial values for fields from the redux store', () => {
    const { getByPlaceholderText } = setup({
      firstName: 'First test',
      lastName: 'Last test',
      inmateNumber: '8',
      relationship: 'Brother',
      facility: {
        address: 'Address',
        city: 'City',
        name: 'Facility Name',
        postal: '23232',
        state: 'MN',
        type: 'State Prison',
      },
    });
    expect(getByPlaceholderText('First name').props.value).toBe('First test');
    expect(getByPlaceholderText('Last name').props.value).toBe('Last test');
  });

  it('enable api call from save profile button when at least one field changes', () => {
    const { getByPlaceholderText, getByText } = setup();
    const saveButton = getByText('Save Profile');
    fireEvent.press(saveButton);
    expect(updateContact).toHaveBeenCalledTimes(0);
    fireEvent.changeText(getByPlaceholderText('First name'), '');
    fireEvent.changeText(getByPlaceholderText('First name'), 'Doe');
    fireEvent.press(saveButton);
    expect(updateContact).toHaveBeenCalledTimes(1);
  });

  it('should make an api call when delete profile button is pressed', () => {
    const { getByText } = setup();
    fireEvent.press(getByText('Delete Profile'));
    expect(deleteContact).toHaveBeenCalledTimes(1);
  });
});
