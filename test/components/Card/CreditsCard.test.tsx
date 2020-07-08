import React from 'react';
import { CreditsCard } from '@components';
import { fireEvent, render, toJSON } from '@testing-library/react-native';

const setup = (propOverrides = {}) => {
  const props = {
    credits: 4,
    onPress: jest.fn(),
    ...propOverrides,
  };
  return {
    ...render(<CreditsCard {...props} />),
    props,
  };
};

describe('Credits Card component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should fire onPress() on Add More press', () => {
    const { props, getByText } = setup();
    fireEvent.press(getByText('Add more'));
    expect(props.onPress).toHaveBeenCalledTimes(1);
  });

  it('should display correct number of credits', () => {
    const { getByText } = setup();
    expect(getByText('4 Credits left')).toBeDefined();
  });

  it('should display reset daily message', () => {
    const { getByText } = setup();
    expect(getByText('Credits reset daily')).toBeDefined();
  });
});
