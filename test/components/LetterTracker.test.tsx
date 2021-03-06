import React from 'react';
import { LetterTracker } from '@components';
import { render, toJSON } from '@testing-library/react-native';
import { LetterStatus } from 'types';

jest.mock('date-fns', () => ({
  format: () => 'Jul 12',
}));

const setup = (propOverrides = {}) => {
  const props = {
    trackingEvent: {
      id: 1,
      name: 'Mailed',
      location: {
        city: 'City',
      },
      date: new Date('2019-07-12T15:51:41.000Z'),
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

  it('should display city', () => {
    const { getByText } = setup();
    expect(getByText('City')).toBeDefined();
  });

  it('should display formatted date', () => {
    const { getByTestId } = setup();
    expect(getByTestId('dateFormatted').props.children).toBe('Jul 12');
  });

  it('should display tracker color for status Mailed', () => {
    const { getByTestId } = setup({ name: LetterStatus.Mailed });
    expect(getByTestId('trackerCircle').props.style.backgroundColor).toBe(
      '#CFF3DD'
    );
  });

  it('should display tracker color for status InTransit', () => {
    const { getByTestId } = setup({ name: LetterStatus.InTransit });
    expect(getByTestId('trackerCircle').props.style.backgroundColor).toBe(
      '#9EE2B8'
    );
  });

  it('should display tracker color for status ProcessedForDelivery', () => {
    const { getByTestId } = setup({ name: LetterStatus.ProcessedForDelivery });
    expect(getByTestId('trackerCircle').props.style.backgroundColor).toBe(
      '#43BF75'
    );
  });

  it('should display tracker color for status Delivered', () => {
    const { getByTestId } = setup({ name: LetterStatus.Delivered });
    expect(getByTestId('trackerCircle').props.style.backgroundColor).toBe(
      '#21A453'
    );
  });
});
