import React from "react";
import { Input } from "@components";
import renderer from "react-test-renderer";
import { TextInput, View, ScrollView } from "react-native";
import { Validation } from "@utils";
import { Colors } from "@styles";

const setup = (propOverrides = {}) => {
  const props = Object.assign(
    {
      onFocus: jest.fn(),
      onBlur: jest.fn(),
      onValid: jest.fn(),
      onInvalid: jest.fn(),
    },
    propOverrides
  );
  const element = renderer.create(<Input {...props} />);
  const instance = element.getInstance();
  return {
    props,
    element,
    instance,
  };
};

describe("Input component", () => {
  it("should render", () => {
    const { element } = setup();
    const tree = element.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("should set focus and dirty correctly", () => {
    const { element, instance } = setup();
    const input = element.root;
    const textInput = input.findByType(TextInput);
    expect(instance.state.focused).toBe(false);
    expect(instance.state.dirty).toBe(false);
    textInput.props.onFocus();
    expect(instance.state.focused).toBe(true);
    expect(instance.state.dirty).toBe(true);
    textInput.props.onBlur();
    expect(instance.state.focused).toBe(false);
    expect(instance.state.dirty).toBe(true);
  });
  it("should set border color blue on focus, black when valid and not focused", () => {
    const { element } = setup();
    const textInput = element.root.findByType(TextInput);
    expect(textInput.props.style[0].borderColor).toBe(Colors.AMEELIO_BLACK);
    textInput.props.onFocus();
    expect(textInput.props.style[0].borderColor).toBe(Colors.AMEELIO_BLUE);
    textInput.props.onBlur();
    expect(textInput.props.style[0].borderColor).toBe(Colors.AMEELIO_BLACK);
  });
  it("should accept input", () => {
    const { element, instance } = setup();
    const input = element.root;
    const textInput = element.root.findByType(TextInput);
    textInput.props.onChangeText("New Text");
    expect(instance.state.value).toBe("New Text");
  });
  it("should validate required fields correctly", () => {
    const { element, instance } = setup({ required: true });
    const input = element.root;
    const textInput = input.findByType(TextInput);
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("Something");
    expect(instance.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("");
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
  });
  it("should validate cell phone numbers correctly", () => {
    const { element, instance } = setup({ validate: Validation.Cell });
    const input = element.root;
    const textInput = input.findByType(TextInput);
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("6127038623");
    expect(instance.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("not an number");
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("123456789");
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("612-703-8623");
    expect(instance.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("(612)7038623");
    expect(instance.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("223330202911");
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(3);
    textInput.props.onChangeText("(612)703-8623");
    expect(instance.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(3);
    textInput.props.onChangeText("(612) 703 8623");
    expect(instance.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(3);
  });
  it("should validate emails", () => {
    const { element, instance } = setup({ validate: Validation.Email });
    const input = element.root;
    const textInput = input.findByType(TextInput);
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("valid@gmail.com");
    expect(instance.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("not an email");
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("almostvalid@gmail");
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("@notvalid.com");
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("newvalid@aol.org");
    expect(instance.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(2);
  });
  it("should validate zipcodes", () => {
    const { element, instance } = setup({ validate: Validation.Zipcode });
    const input = element.root;
    const textInput = input.findByType(TextInput);
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("55419");
    expect(instance.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("453");
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("554190");
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("55419-1234");
    expect(instance.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("554191234");
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(3);
    textInput.props.onChangeText("55419-123");
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(3);
    textInput.props.onChangeText("abcde");
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(3);
  });
  it("should validate passwords", () => {
    const { element, instance } = setup({ validate: Validation.Password });
    const input = element.root;
    const textInput = input.findByType(TextInput);
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("GoodPassword1");
    expect(instance.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("NoNumber");
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("nouppercase3");
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("AbcDef66");
    expect(instance.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("Short1");
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(3);
    textInput.props.onChangeText("HFJFJFJF3432");
    expect(instance.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(3);
  });
  it("should set the border and background red when invalid", () => {
    const { element, instance } = setup({ required: true });
    const input = element.root;
    const textInput = input.findByType(TextInput);
    expect(instance.state.valid).toBe(false);
    expect(instance.state.dirty).toBe(false);
    expect(textInput.props.style[0].borderColor).toBe(Colors.AMEELIO_BLACK);
    textInput.props.onFocus();
    textInput.props.onBlur();
    expect(instance.state.valid).toBe(false);
    expect(instance.state.dirty).toBe(true);
    expect(textInput.props.style[0].borderColor).toBe(Colors.AMEELIO_RED);
    expect(textInput.props.style[0].backgroundColor).toBe(Colors.ALERT_LIGHT);
  });
  it("should implement style props", () => {
    const parentStyle = { backgroundColor: "green" };
    const scrollStyle = { backgroundColor: "red" };
    const inputStyle = { backgroundColor: "yellow" };
    const { element } = setup({
      parentStyle: parentStyle,
      scrollStyle: scrollStyle,
      inputStyle: inputStyle,
    });
    const input = element.root;
    const view = input.findByType(View);
    const scrollView = input.findByType(ScrollView);
    const textInput = input.findByType(TextInput);
    expect(view.props.style[1]).toEqual(parentStyle);
    expect(scrollView.props.style[1]).toEqual(scrollStyle);
    expect(textInput.props.style[1]).toEqual(inputStyle);
  });
  test("placeholder and secure implemented correctly", () => {
    const { element } = setup({
      placeholder: "placeholder",
      secure: true,
    });
    const input = element.root;
    const textInput = input.findByType(TextInput);
    expect(textInput.props.placeholder).toBe("placeholder");
    expect(textInput.props.secureTextEntry).toBe(true);
  });
});
