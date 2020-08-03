import React from 'react';
import { MemoryLanePostcardCard } from '@components';
import { fireEvent, render, toJSON } from '@testing-library/react-native';

const setup = (propOverrides = {}) => {
  const props = {
    date: new Date('2019-07-12T15:51:41.000Z'),
    imageUri: 'test',
    color: 'green',
    onPress: jest.fn(),
    ...propOverrides,
  };
  return {
    ...render(<MemoryLanePostcardCard {...props} />),
    props,
  };
};

describe('MemoryLanePhotoCard component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should fire onPress() on a press', () => {
    const { props, getByTestId } = setup();
    fireEvent.press(getByTestId('memoryLanePostcardImage'));
    expect(props.onPress).toHaveBeenCalledTimes(1);
  });

  it('should display date', () => {
    const { getByText } = setup();
    expect(getByText('July 12')).toBeDefined();
  });

  it('should display memory lane image', () => {
    const { getByTestId } = setup();
    expect(getByTestId('memoryLanePostcardImage').props.source.uri).toBe(
      'test'
    );
  });
});
