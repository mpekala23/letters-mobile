import React from 'react';
import { Button } from '@components';
import { fireEvent, render, toJSON } from '@testing-library/react-native';
import { Colors } from '@styles';

const setup = (propOverrides = {}) => {
  const props = {
    onPress: jest.fn(),
    buttonText: 'press me',
    ...propOverrides,
  };
  return {
    ...render(<Button {...props} />),
    props,
  };
};

describe('Button component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should implement style props when enabled', () => {
    const containerStyle = { backgroundColor: 'green' };
    const textStyle = { color: 'red' };
    const { getByText, getByTestId } = setup({
      containerStyle,
      textStyle,
    });
    expect(getByTestId('clickable').props.style[2]).toEqual(containerStyle);
    expect(getByText('press me').props.style[2]).toEqual(textStyle);
  });

  it('should implement a reverse style', () => {
    const { getByText } = setup({
      reverse: true,
    });
    expect(getByText('press me').props.style[0].color).toEqual(
      Colors.AMEELIO_BLUE
    );
  });

  it('should implement a disabled style', () => {
    const disabledContainerStyle = { backgroundColor: 'green' };
    const disabledTextStyle = { color: 'red' };
    const { getByText, getByTestId } = setup({
      disabledContainerStyle,
      disabledTextStyle,
      enabled: false,
    });
    expect(getByTestId('clickable').props.style[3]).toEqual(
      disabledContainerStyle
    );
    expect(getByText('press me').props.style[3]).toEqual(disabledTextStyle);
  });

  it('should implement a link style', () => {
    const containerStyle = { backgroundColor: 'green' };
    const { getByTestId } = setup({
      containerStyle,
      link: true,
    });
    expect(getByTestId('clickable').props.style).toEqual(containerStyle);
  });

  it('should call onPress() when pressed and enabled', () => {
    const { props, getByTestId } = setup({
      enabled: true,
    });
    fireEvent.press(getByTestId('clickable'));
    expect(props.onPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress() when pressed and disabled', () => {
    const { props, getByTestId } = setup({
      enabled: false,
    });
    fireEvent.press(getByTestId('clickable'));
    expect(props.onPress).toHaveBeenCalledTimes(0);
  });
});
