import React from 'react';
import { LetterStatusCard } from '@components';
import { fireEvent, render, toJSON } from '@testing-library/react-native';

jest.mock('moment', () => () => ({
  format: () => 'Jul 12',
}));

const setup = (propOverrides = {}) => {
  const props = {
    status: 'Status',
    date: '2019-07-12',
    description: 'Description',
    color: 'green',
    onPress: jest.fn(),
    ...propOverrides,
  };
  return {
    ...render(<LetterStatusCard {...props} />),
    props,
  };
};

describe('Letter Status Card component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should fire onPress() on a press', () => {
    const { props, getByText } = setup();
    fireEvent.press(getByText('Status'));
    expect(props.onPress).toHaveBeenCalledTimes(1);
  });

  it('should display status', () => {
    const { getByText } = setup();
    expect(getByText('Status')).toBeDefined();
  });

  it('should display date', () => {
    const { getByText } = setup();
    expect(getByText('Jul 12')).toBeDefined();
  });

  it('should display description', () => {
    const { getByText } = setup();
    expect(getByText('Description')).toBeDefined();
  });
});
