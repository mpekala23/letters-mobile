import React from "react";
import { Dropdown } from "@components";
import renderer from "react-test-renderer";

const setup = () => {
  const element = renderer.create(<Dropdown />);
  const instance = element.getInstance();
  return {
    element,
    instance,
  };
};

describe("Dropdown component", () => {
  it("should render", () => {
    const { element } = setup();
    const tree = element.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
