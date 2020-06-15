import React from "react";
import { PicUpload } from "@components";
import { render, toJSON } from "@testing-library/react-native";
import { Image, TouchableOpacity } from "react-native";

const setup = () => {
  return render(<PicUpload />);
};

describe("PicUpload component", () => {
  it("should match snapshot", () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it("should display blank with no image", () => {
    const { getByTestId } = setup();
    expect(getByTestId("clickable").children.length).toBe(0);
  });
});
