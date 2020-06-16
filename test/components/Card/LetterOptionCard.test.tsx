import React from "react";
import { LetterOptionCard } from "@components";
import { fireEvent, render, toJSON } from "@testing-library/react-native";

const setup = (propOverrides = {}) => {
  const props = Object.assign(
    {
      title: "Title",
      description: "Description",
      onPress: jest.fn(),
    },
    propOverrides
  );
  return {
    ...render(<LetterOptionCard {...props} />),
    props,
  };
};

describe("Letter Option Card component", () => {
  it("should match snapshot", () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it("should fire onPress() on a press", () => {
    const { props, getByText } = setup();
    fireEvent.press(getByText("Title"));
    expect(props.onPress).toHaveBeenCalledTimes(1);
  });

  it("should display title", () => {
    const { getByText } = setup();
    expect(getByText("Title")).toBeDefined();
  });

  it("should display description", () => {
    const { getByText } = setup();
    expect(getByText("Description")).toBeDefined();
  });
});
