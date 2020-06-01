import React from "react";
import { Button } from "@components";
import renderer from "react-test-renderer";
import { Text, TouchableOpacity } from "react-native";
import { Colors } from "@styles";

const setup = (propOverrides = {}) => {
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
  it("should render", () => {
    const { element } = setup();
    const tree = element.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("should implement style props when enabled", () => {
    const containerStyle = { backgroundColor: "green" };
    const textStyle = { color: "red" };
    const { element } = setup({
      containerStyle: containerStyle,
      textStyle: textStyle,
    });
    const input = element.root;
    const touchable = input.findByType(TouchableOpacity);
    const text = input.findByType(Text);
    expect(touchable.props.style[2]).toEqual(containerStyle);
    expect(text.props.style[2]).toEqual(textStyle);
  });
  it("should implement a reverse style", () => {
    const { element } = setup({
      reverse: true,
    });
    const input = element.root;
    const text = input.findByType(Text);
    expect(text.props.style[0].color).toEqual(Colors.AMEELIO_BLUE);
  });
  it("should implement a disabled style", () => {
    const disabledContainerStyle = { backgroundColor: "green" };
    const disabledTextStyle = { color: "red" };
    const { element } = setup({
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
  it("should implement a link style", () => {
    const containerStyle = { backgroundColor: "green" };
    const { element } = setup({
      containerStyle: containerStyle,
      link: true,
    });
    const input = element.root;
    const touchable = input.findByType(TouchableOpacity);
    const text = input.findByType(Text);
    expect(touchable.props.style).toEqual(containerStyle);
  });
  it("should have a functioning onPress when enabled", () => {
    const { element } = setup({
      enabled: true,
    });
    const input = element.root;
    const touchable = input.findByType(TouchableOpacity);
    touchable.props.onPress();
    expect(input.props.onPress).toHaveBeenCalledTimes(1);
  });
  it("should not have a functioning onPress when disabled", () => {
    const { element } = setup({
      enabled: false,
    });
    const input = element.root;
    const touchable = input.findByType(TouchableOpacity);
    touchable.props.onPress();
    expect(input.props.onPress).toHaveBeenCalledTimes(0);
  });
});
