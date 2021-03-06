import React, { createRef } from 'react';
import { Input } from '@components';
import { Validation } from '@utils';
import { render, toJSON, fireEvent, act } from '@testing-library/react-native';
import { View } from 'react-native';

const setup = (propOverrides = {}) => {
  const props = {
    onFocus: jest.fn(),
    onBlur: jest.fn(),
    onValid: jest.fn(),
    onInvalid: jest.fn(),
    placeholder: 'placeholder',
    ...propOverrides,
  };
  return {
    ...render(<Input {...props} />),
    props,
  };
};

describe('Input component', () => {
  /* it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it('should begin unfocused and update when focused', () => {
    const { getByPlaceholderText, getByTestId } = setup();
    expect(getByTestId('unfocused')).toBeDefined();
    fireEvent.focus(getByPlaceholderText('placeholder'));
    expect(getByTestId('focused')).toBeDefined();
    fireEvent.blur(getByPlaceholderText('placeholder'));
    expect(getByTestId('unfocused')).toBeDefined();
  });

  it('should accept input', () => {
    const { getByPlaceholderText } = setup();
    fireEvent.changeText(getByPlaceholderText('placeholder'), 'New Text');
    expect(getByPlaceholderText('placeholder').props.value).toBe('New Text');
  });

  it('should validate required fields correctly', () => {
    const { props, getByPlaceholderText } = setup({ required: true });
    const textInput = getByPlaceholderText('placeholder');
    // expect(props.onInvalid).toHaveBeenCalledTimes(1);
    fireEvent.focus(textInput);
    fireEvent.changeText(textInput, 'something');
    fireEvent.blur(textInput);
    // expect(props.onValid).toHaveBeenCalledTimes(1);
    fireEvent.changeText(textInput, '');
    // expect(props.onInvalid).toHaveBeenCalledTimes(2);
  });

  it('should validate phone numbers correctly', () => {
    const { props, getByPlaceholderText } = setup({
      validate: Validation.Phone,
    });
    const textInput = getByPlaceholderText('placeholder');
    // expect(props.onInvalid).toHaveBeenCalledTimes(1);
    fireEvent.focus(textInput);
    fireEvent.changeText(textInput, '6127038623');
    fireEvent.blur(textInput);
    // expect(props.onValid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText('not an number');
    // expect(props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText('123456789');
    // expect(props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText('612-703-8623');
    // expect(props.onValid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText('(612)7038623');
    // expect(props.onValid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText('223330202911');
    // expect(props.onInvalid).toHaveBeenCalledTimes(3);
    textInput.props.onChangeText('(612)703-8623');
    // expect(props.onValid).toHaveBeenCalledTimes(3);
    textInput.props.onChangeText('(612) 703 8623');
    // expect(props.onValid).toHaveBeenCalledTimes(3);
  });

  it('should validate emails', () => {
    const { props, getByPlaceholderText } = setup({
      validate: Validation.Email,
    });
    const textInput = getByPlaceholderText('placeholder');
    // expect(props.onInvalid).toHaveBeenCalledTimes(1);
    fireEvent.focus(textInput);
    fireEvent.changeText(textInput, 'valid@gmail.com');
    fireEvent.blur(textInput);
    // expect(props.onValid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText('not an email');
    // expect(props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText('almostvalid@gmail');
    // expect(props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText('@notvalid.com');
    // expect(props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText('newvalid@aol.org');
    // expect(props.onValid).toHaveBeenCalledTimes(2);
  });

  it('should validate postal zipcodes', () => {
    const { props, getByPlaceholderText } = setup({
      validate: Validation.Postal,
    });
    const textInput = getByPlaceholderText('placeholder');
    // expect(props.onInvalid).toHaveBeenCalledTimes(1);
    fireEvent.focus(textInput);
    fireEvent.changeText(textInput, '55419');
    fireEvent.blur(textInput);
    // expect(props.onValid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText('5541');
    // expect(props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText('554199');
    // expect(props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText('55419-123');
    // expect(props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText('55419-1234');
    // expect(props.onValid).toHaveBeenCalledTimes(2);
  });

  it('should validate passwords', () => {
    const { props, getByPlaceholderText } = setup({
      validate: Validation.Password,
    });
    const textInput = getByPlaceholderText('placeholder');
    // expect(props.onInvalid).toHaveBeenCalledTimes(1);
    fireEvent.focus(textInput);
    fireEvent.changeText(textInput, 'GoodPassword1');
    fireEvent.blur(textInput);
    // expect(props.onValid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText('NoNumber');
    // expect(props.onInvalid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText('nouppercase3');
    // expect(props.onInvalid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText('Short1');
    // expect(props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText('AbcDef66');
    // expect(props.onValid).toHaveBeenCalledTimes(2);
  });

  it('should validate states', () => {
    const { props, getByPlaceholderText } = setup({
      validate: Validation.State,
    });
    const textInput = getByPlaceholderText('placeholder');
    // expect(props.onInvalid).toHaveBeenCalledTimes(1);
    fireEvent.focus(textInput);
    fireEvent.changeText(textInput, 'Minnesota');
    fireEvent.blur(textInput);
    // expect(props.onValid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText('Not State');
    // expect(props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText('Nope');
    // expect(props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText('Nah');
    // expect(props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText('Utah');
    // expect(props.onValid).toHaveBeenCalledTimes(2);
  });

  it('should implement style props', () => {
    const parentStyle = { backgroundColor: 'green' };
    const inputStyle = { backgroundColor: 'yellow' };
    const { getByPlaceholderText, getByTestId } = setup({
      parentStyle,
      inputStyle,
    });
    expect(getByTestId('parent').props.style.backgroundColor).toEqual(
      parentStyle.backgroundColor
    );
    expect(getByPlaceholderText('placeholder').props.style[4]).toEqual(
      inputStyle
    );
  });

  it('should implement secure', () => {
    const { getByPlaceholderText } = setup({ secure: true });
    expect(getByPlaceholderText('placeholder').props.secureTextEntry).toBe(
      true
    );
  });
  it('should implement simple dropdowns', () => {
    const { getByPlaceholderText, getByText } = setup({
      options: ['Option 1', 'Option 2'],
    });
    const input = getByPlaceholderText('placeholder');
    fireEvent.focus(input);
    const option1 = getByText('Option 1');
    expect(option1).toBeDefined();
    fireEvent.press(option1);
    expect(input.props.value).toBe('Option 1');
  });

  it('should implement complex dropdowns', () => {
    const { getByPlaceholderText, getByText } = setup({
      options: [
        ['Option 1', 'option one'],
        ['Option 2', 'option two'],
      ],
    });
    const input = getByPlaceholderText('placeholder');
    fireEvent.focus(input);
    fireEvent.changeText(input, 'option tw');
    const option2 = getByText('Option 2');
    expect(option2).toBeDefined();
    fireEvent.press(option2);
    expect(input.props.value).toBe('Option 2');
  });

  it('should implement nextInput', () => {
    const dummyRef = createRef<Input>();
    const dummyFocus = jest.fn();
    const { getByPlaceholderText } = render(
      <View>
        <Input placeholder="placeholder" nextInput={dummyRef} />
        <Input ref={dummyRef} placeholder="dummy" onFocus={dummyFocus} />
      </View>
    );
    dummyRef.current.forceFocus = dummyFocus;
    const input = getByPlaceholderText('placeholder');
    fireEvent.press(input);
    fireEvent.changeText(input, 'value');
    fireEvent.submitEditing(input);
    // expect(dummyFocus).toHaveBeenCalledTimes(1);
  });

  it('should implement must match', () => {
    const { props, getByPlaceholderText } = setup({ mustMatch: 'match' });
    const input = getByPlaceholderText('placeholder');
    // expect(props.onValid).toHaveBeenCalledTimes(1);
    fireEvent.changeText(input, 'not match');
    // expect(props.onInvalid).toHaveBeenCalledTimes(1);
    fireEvent.changeText(input, 'match');
    // expect(props.onValid).toHaveBeenCalledTimes(2);
  });

  it('should implement invalid label', () => {
    const { getByPlaceholderText, getByText } = setup({
      required: true,
      validate: Validation.State,
      invalidFeedback: 'wrong',
    });
    const input = getByPlaceholderText('placeholder');
    act(() => {
      fireEvent.focus(input);
      fireEvent.changeText(input, 'not a state');
      fireEvent.blur(input);
    });
    // expect(getByText('wrong')).toBeDefined();
  }); */
});
