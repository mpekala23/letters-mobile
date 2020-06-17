import React from "react";
import { PrisonCard } from "@components";
import { fireEvent, render, toJSON } from "@testing-library/react-native";

const setup = (propOverrides = {}) => {
  const props = Object.assign(
    {
      name: "Name",
      type: "StatePrison",
      address: "Address",
      onPress: jest.fn(),
    },
    propOverrides
  );
  return {
    ...render(<PrisonCard {...props} />),
    props,
  };
};

describe("Prison Card component", () => {
  it("should match snapshot", () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it("should fire onPress() on a press", () => {
    const { props, getByText } = setup();
    fireEvent.press(getByText("Name"));
    expect(props.onPress).toHaveBeenCalledTimes(1);
  });

  it("should display name", () => {
    const { getByText } = setup();
    expect(getByText("Name")).toBeDefined();
  });

  it("should display prison type", () => {
    const { getByText } = setup();
    expect(getByText("State Prison")).toBeDefined();
  });

  it("should display address", () => {
    const { getByText } = setup();
    expect(getByText("Address")).toBeDefined();
  });
});
