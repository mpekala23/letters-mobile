import React from "react";
import { PicUpload } from "@components";
import renderer from "react-test-renderer";
import { Image, TouchableOpacity } from "react-native";

const setup = () => {
  const element = renderer.create(<PicUpload />);
  return {
    element,
  };
};

describe("PicUpload component", () => {
  it("should render", () => {
    const { element } = setup();
    const tree = element.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("should display blank with no image", () => {
    const { element } = setup();
    const picUpload = element.root;
    const touchable = picUpload.findByType(TouchableOpacity);
    expect(touchable).toBeDefined();
    const image = picUpload.findAllByType(Image);
    expect(image.length).toBe(0);
  });
});
