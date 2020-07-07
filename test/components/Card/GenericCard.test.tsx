import React from 'react';
import { Text } from 'react-native';
import { GenericCard } from '@components';
import { fireEvent, render, toJSON } from '@testing-library/react-native';

const setup = (propOverrides: Record<string, unknown> = {}) => {
  const props = {
    ...propOverrides,
  };
  return {
    ...render(<GenericCard {...props} />),
    props,
  };
};

describe('Generic Card component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should fire onPress() on a press', () => {
    const dummy = jest.fn();
    const { getByTestId } = setup({ onPress: dummy });
    fireEvent.press(getByTestId('GenericTouch'));
    expect(dummy).toHaveBeenCalledTimes(1);
  });

  it('should render children', () => {
    const { getByText } = setup({ children: <Text>Children</Text> });
    expect(getByText('Children')).toBeDefined();
  });
});
