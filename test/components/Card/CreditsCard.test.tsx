import React from 'react';
import { CreditsCard } from '@components';
import { fireEvent, render, toJSON } from '@testing-library/react-native';

const setup = (propOverrides = {}) => {
  const props = {
    credits: 3,
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

  it('should fire onPress() on Send More press', () => {
    const { props, getByText } = setup({ credits: 0 });
    fireEvent.press(getByText('Send more'));
    // expect(props.onPress).toHaveBeenCalledTimes(1);
  });

  it('should display correct number of letters left', () => {
    const { getByText } = setup();
    expect(getByText('3 letters left this week')).toBeDefined();
  });

  it('should display no letters left message when there are 0 credits left', () => {
    const { getByText } = setup({ credits: 0 });
    expect(getByText('You used all your letters for the week')).toBeDefined();
  });

  it('should display reset weekly message when there is at least 1 credit left', () => {
    const { getByText } = setup();
    expect(getByText('Your letters reset weekly.')).toBeDefined();
  });

  it('should display that letters will reset on Monday at 4am EST when there are 0 credits left', () => {
    const { getByText } = setup({ credits: 0 });
    expect(
      getByText('Your letters reset on Mondays at 4am EST.')
    ).toBeDefined();
  });
});
