import React from 'react';
import { ContactSelectorCard } from '@components';
import { fireEvent, render, toJSON } from '@testing-library/react-native';

jest.mock('date-fns', () => ({
  format: () => 'Jul 12',
}));

const setup = (propOverrides = {}) => {
  const props = {
    firstName: 'Jane',
    lastName: 'Doe',
    letters: [
      {
        isDraft: true,
        recipientId: 8,
        content: 'Text',
        dateCreated: 'Jul 12',
      },
    ],
    onPress: jest.fn(),
    ...propOverrides,
  };
  return {
    ...render(<ContactSelectorCard {...props} />),
    props,
  };
};

describe('Contact Selector Card component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should display first name', () => {
    const { getByText } = setup();
    expect(getByText('Jane')).toBeDefined();
  });

  it('should display profile picture', () => {
    const { getByTestId } = setup();
    expect(getByTestId('profilePicture')).toBeDefined();
  });

  it('should fire onPress() on press of contact card', () => {
    const { props, getByText } = setup();
    fireEvent.press(getByText('Jane'));
    expect(props.onPress).toHaveBeenCalledTimes(1);
  });

  // TO-DO: Write tests for correct # of letters, last heard, miles after API integration
});
