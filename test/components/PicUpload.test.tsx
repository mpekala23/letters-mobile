import React from "react";
import { PicUpload } from "@components";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Image, TouchableOpacity } from "react-native";

Enzyme.configure({ adapter: new Adapter() });

const setupShallow = () => {
  const wrapper = shallow(<PicUpload />);

  return {
    wrapper,
  };
};

const setupInstance = () => {
  const element = renderer.create(<PicUpload />);
  const instance = element.getInstance();
  return {
    element,
    instance,
  };
};

describe("PicUpload component", () => {
  test("renders", () => {
    const { wrapper } = setupShallow();
    expect(wrapper).toMatchSnapshot();
  });
  test("displays blank with no image", () => {
    const { element } = setupInstance();
    const picUpload = element.root;
    const touchable = picUpload.findByType(TouchableOpacity);
    expect(touchable).toBeDefined();
    const image = picUpload.findAllByType(Image);
    expect(image.length).toBe(0);
  });
});
