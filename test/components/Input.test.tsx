import React from "react";
import { Input } from "@components";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { TextInput, View, ScrollView } from "react-native";
import { Validation } from "@utils";
import { Colors } from "@styles";

Enzyme.configure({ adapter: new Adapter() });

const setupShallow = (propOverrides) => {
  const props = Object.assign(
    {
      onFocus: jest.fn(),
      onBlur: jest.fn(),
      onValid: jest.fn(),
      onInvalid: jest.fn(),
    },
    propOverrides
  );

  const wrapper = shallow(<Input {...props} />);

  return {
    props,
    wrapper,
  };
};

const setupInstance = (propOverrides) => {
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
  test("renders", () => {
    const { wrapper } = setupShallow();
    console.log(wrapper.instance());
    expect(wrapper).toMatchSnapshot();
  });
  test("focus and dirty set correctly", () => {
    const { element } = setupInstance();
    const input = element.root;
    const textInput = input.findByType(TextInput);
    expect(input._fiber.stateNode.state.focused).toBe(false);
    expect(input._fiber.stateNode.state.dirty).toBe(false);
    textInput.props.onFocus();
    expect(input._fiber.stateNode.state.focused).toBe(true);
    expect(input._fiber.stateNode.state.dirty).toBe(true);
    textInput.props.onBlur();
    expect(input._fiber.stateNode.state.focused).toBe(false);
    expect(input._fiber.stateNode.state.dirty).toBe(true);
  });
  test("border color blue on focus, black when valid and not focused", () => {
    const { element } = setupInstance();
    const textInput = element.root.findByType(TextInput);
    expect(textInput.props.style[0].borderColor).toBe(Colors.AMEELIO_BLACK);
    textInput.props.onFocus();
    expect(textInput.props.style[0].borderColor).toBe(Colors.AMEELIO_BLUE);
    textInput.props.onBlur();
    expect(textInput.props.style[0].borderColor).toBe(Colors.AMEELIO_BLACK);
  });
  test("accepts input", () => {
    const { element } = setupInstance();
    const input = element.root;
    const textInput = element.root.findByType(TextInput);
    textInput.props.onChangeText("New Text");
    expect(input._fiber.stateNode.state.value).toBe("New Text");
  });
  test("required validation", () => {
    const { element } = setupInstance({ required: true });
    const input = element.root;
    const textInput = input.findByType(TextInput);
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("Something");
    expect(input._fiber.stateNode.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("");
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
  });
  test("cell validation", () => {
    const { element } = setupInstance({ validate: Validation.Cell });
    const input = element.root;
    const textInput = input.findByType(TextInput);
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("6127038623");
    expect(input._fiber.stateNode.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("not an number");
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("123456789");
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("612-703-8623");
    expect(input._fiber.stateNode.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("(612)7038623");
    expect(input._fiber.stateNode.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("223330202911");
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(3);
    textInput.props.onChangeText("(612)703-8623");
    expect(input._fiber.stateNode.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(3);
    textInput.props.onChangeText("(612) 703 8623");
    expect(input._fiber.stateNode.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(3);
  });
  test("email validation", () => {
    const { element } = setupInstance({ validate: Validation.Email });
    const input = element.root;
    const textInput = input.findByType(TextInput);
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("valid@gmail.com");
    expect(input._fiber.stateNode.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("not an email");
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("almostvalid@gmail");
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("@notvalid.com");
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("newvalid@aol.org");
    expect(input._fiber.stateNode.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(2);
  });
  test("zipcode validation", () => {
    const { element } = setupInstance({ validate: Validation.Zipcode });
    const input = element.root;
    const textInput = input.findByType(TextInput);
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("55419");
    expect(input._fiber.stateNode.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("453");
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("554190");
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("55419-1234");
    expect(input._fiber.stateNode.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("554191234");
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(3);
    textInput.props.onChangeText("55419-123");
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(3);
    textInput.props.onChangeText("abcde");
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(3);
  });
  test("password validation", () => {
    const { element } = setupInstance({ validate: Validation.Password });
    const input = element.root;
    const textInput = input.findByType(TextInput);
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("GoodPassword1");
    expect(input._fiber.stateNode.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(1);
    textInput.props.onChangeText("NoNumber");
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("nouppercase3");
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("AbcDef66");
    expect(input._fiber.stateNode.state.valid).toBe(true);
    expect(input.props.onValid).toHaveBeenCalledTimes(2);
    textInput.props.onChangeText("Short1");
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(3);
    textInput.props.onChangeText("HFJFJFJF3432");
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input.props.onInvalid).toHaveBeenCalledTimes(3);
  });
  test("border and background is red when invalid", () => {
    const { element } = setupInstance({ required: true });
    const input = element.root;
    const textInput = input.findByType(TextInput);
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input._fiber.stateNode.state.dirty).toBe(false);
    expect(textInput.props.style[0].borderColor).toBe(Colors.AMEELIO_BLACK);
    textInput.props.onFocus();
    textInput.props.onBlur();
    expect(input._fiber.stateNode.state.valid).toBe(false);
    expect(input._fiber.stateNode.state.dirty).toBe(true);
    expect(textInput.props.style[0].borderColor).toBe(Colors.AMEELIO_RED);
    expect(textInput.props.style[0].backgroundColor).toBe(Colors.ALERT_LIGHT);
  });
  test("style props implemented correctly", () => {
    const parentStyle = { backgroundColor: "green" };
    const scrollStyle = { backgroundColor: "red" };
    const inputStyle = { backgroundColor: "yellow" };
    const { element } = setupInstance({
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
    const { element } = setupInstance({
      placeholder: "placeholder",
      secure: true,
    });
    const input = element.root;
    const textInput = input.findByType(TextInput);
    expect(textInput.props.placeholder).toBe("placeholder");
    expect(textInput.props.secureTextEntry).toBe(true);
  });
});
