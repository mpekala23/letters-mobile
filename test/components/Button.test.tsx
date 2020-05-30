import React from "react";
import { Button } from "@components";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Text, TouchableOpacity } from "react-native";
import { Colors } from "@styles";

Enzyme.configure({ adapter: new Adapter() });

const setupShallow = (propOverrides) => {
  const props = Object.assign(
    {
      onPress: jest.fn(),
      buttonText: "press me",
    },
    propOverrides
  );

  const wrapper = shallow(<Button {...props} />);

  return {
    props,
    wrapper,
  };
};

const setupInstance = (propOverrides) => {
  const props = Object.assign(
    {
      onPress: jest.fn(),
      buttonText: "press me",
    },
    propOverrides
  );
  const element = renderer.create(<Button {...props} />);
  const instance = element.getInstance();
  return {
    props,
    element,
    instance,
  };
};

describe("Button component", () => {
  test("renders", () => {
    const { wrapper } = setupShallow();
    expect(wrapper).toMatchSnapshot();
  });
  test("style props implemented correctly when enabled", () => {
    const containerStyle = { backgroundColor: "green" };
    const textStyle = { color: "red" };
    const { element } = setupInstance({
      containerStyle: containerStyle,
      textStyle: textStyle,
    });
    const input = element.root;
    const touchable = input.findByType(TouchableOpacity);
    const text = input.findByType(Text);
    expect(touchable.props.style[2]).toEqual(containerStyle);
    expect(text.props.style[2]).toEqual(textStyle);
  });
  test("style props implemented correctly when reverse", () => {
    const { element } = setupInstance({
      reverse: true,
    });
    const input = element.root;
    const text = input.findByType(Text);
    expect(text.props.style[0].color).toEqual(Colors.AMEELIO_BLUE);
  });
  test("style props implemented correctly when disabled", () => {
    const disabledContainerStyle = { backgroundColor: "green" };
    const disabledTextStyle = { color: "red" };
    const { element } = setupInstance({
      disabledContainerStyle: disabledContainerStyle,
      disabledTextStyle: disabledTextStyle,
      enabled: false,
    });
    const input = element.root;
    const touchable = input.findByType(TouchableOpacity);
    const text = input.findByType(Text);
    expect(touchable.props.style[3]).toEqual(disabledContainerStyle);
    expect(text.props.style[3]).toEqual(disabledTextStyle);
  });
  test("style props implemented correctly when link", () => {
    const containerStyle = { backgroundColor: "green" };
    const { element } = setupInstance({
      containerStyle: containerStyle,
      link: true,
    });
    const input = element.root;
    const touchable = input.findByType(TouchableOpacity);
    const text = input.findByType(Text);
    expect(touchable.props.style).toEqual(containerStyle);
  });
  test("onPress works when enabled", () => {
    const { element } = setupInstance({
      enabled: true,
    });
    const input = element.root;
    const touchable = input.findByType(TouchableOpacity);
    touchable.props.onPress();
    expect(input.props.onPress).toHaveBeenCalledTimes(1);
  });
  test("onPress doesn't work when disabled", () => {
    const { element } = setupInstance({
      enabled: false,
    });
    const input = element.root;
    const touchable = input.findByType(TouchableOpacity);
    touchable.props.onPress();
    expect(input.props.onPress).toHaveBeenCalledTimes(0);
  });
});
