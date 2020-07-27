import React from 'react';
import { ComposeHeader } from '@components';
import { fireEvent, render, toJSON, act } from '@testing-library/react-native';

const setup = (propOverrides = {}) => {
  const props = {
    recipientName: 'Team A',
    ...propOverrides,
  };
  return {
    ...render(<ComposeHeader {...props} />),
    props,
  };
};

describe('ComposeHeader component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should implement recipientName prop', () => {
    const { getByText } = setup();
    expect(getByText('To: Team A')).toBeDefined();
  });

  it('should update button text when feeling stuck is open', async () => {
    jest.useRealTimers();
    const { queryByText } = setup();
    const button = queryByText('Need Ideas?');
    expect(button).toBeTruthy();
    act(() => {
      fireEvent.press(button);
    });
    expect(queryByText('Collapse')).toBeDefined();
    act(() => {
      fireEvent.press(button);
    });
    expect(queryByText('Need Ideas?')).toBeDefined();
  });

  it('should display prompt when open', async () => {
    jest.useRealTimers();
    const { queryByTestId, queryByText } = setup();
    const button = queryByText('Need Ideas?');
    let prompt = queryByTestId('prompt');
    expect(prompt).toBeFalsy();
    fireEvent.press(button);
    prompt = queryByTestId('prompt');
    expect(prompt).toBeTruthy();
    await new Promise((resolve) => setTimeout(resolve, 500)); // await the animation
    fireEvent.press(button);
    await new Promise((resolve) => setTimeout(resolve, 500)); // await the animation
    prompt = queryByTestId('prompt');
    expect(prompt).toBeFalsy();
  });
});
