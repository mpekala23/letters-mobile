import React from 'react';
import { MemoryLaneCard } from '@components';
import { fireEvent, render, toJSON } from '@testing-library/react-native';

const setup = (propOverrides = {}) => {
  const props = {
    type: 'letter',
    text: 'Text',
    date: new Date('2019-07-12T15:51:41.000Z'),
    imageUri: 'test',
    color: 'green',
    onPress: jest.fn(),
    ...propOverrides,
  };
  return {
    ...render(<MemoryLaneCard {...props} />),
    props,
  };
};

describe('Memory Lane Card component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should fire onPress() on a press', () => {
    const { props, getByText } = setup();
    fireEvent.press(getByText('Text'));
    expect(props.onPress).toHaveBeenCalledTimes(1);
  });

  it('should display text', () => {
    const { getByText } = setup();
    expect(getByText('Text')).toBeDefined();
  });

  it('should display date', () => {
    const { getByText } = setup();
    expect(getByText('July 12')).toBeDefined();
  });

  it('should display memory lane image', () => {
    const { getByTestId } = setup();
    expect(getByTestId('memoryLaneImage').props.source.uri).toBe('test');
  });
});
