import React from 'react';
import { LetterTracker } from '@components';
import { render, toJSON } from '@testing-library/react-native';
import { LetterStatus } from 'types';

jest.mock('moment', () => () => ({
  format: () => 'Jul 12',
}));

const setup = (propOverrides = {}) => {
  const props = {
    trackingEvent: {
      id: 1,
      name: 'Mailed',
      location: 'Zipcode',
      date: '2019-07-12T15:51:41.000Z',
      ...propOverrides,
    },
  };
  return {
    ...render(<LetterTracker {...props} />),
    props,
  };
};

describe('Letter Tracker component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should display letter status', () => {
    const { getByText } = setup();
    expect(getByText('Mailed')).toBeDefined();
  });

  it('should display zipcode', () => {
    const { getByText } = setup();
    expect(getByText('Zipcode')).toBeDefined();
  });

  it('should display formatted date', () => {
    const { getByTestId } = setup();
    expect(getByTestId('dateFormatted').props.children).toBe('Jul 12');
  });

  it('should display tracker color for status Mailed', () => {
    const { getByTestId } = setup({ name: LetterStatus.Mailed });
    expect(getByTestId('trackerCircle').props.style.backgroundColor).toBe(
      '#A8C1E4'
    );
  });

  it('should display tracker color for status InTransit', () => {
    const { getByTestId } = setup({ name: LetterStatus.InTransit });
    expect(getByTestId('trackerCircle').props.style.backgroundColor).toBe(
      '#8DA7CC'
    );
  });

  it('should display tracker color for status InLocalArea', () => {
    const { getByTestId } = setup({ name: LetterStatus.InLocalArea });
    expect(getByTestId('trackerCircle').props.style.backgroundColor).toBe(
      '#6D89B1'
    );
  });

  it('should display tracker color for status OutForDelivery', () => {
    const { getByTestId } = setup({ name: LetterStatus.OutForDelivery });
    expect(getByTestId('trackerCircle').props.style.backgroundColor).toBe(
      '#436697'
    );
  });
});
