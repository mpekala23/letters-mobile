import React from "react";
import { Dropdown } from "@components";
import { render, toJSON } from "@testing-library/react-native";

const setup = () => {
  return {
    ...render(<Dropdown />),
  };
};

describe("Dropdown component", () => {
  it("should match snapshot", () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });
});
