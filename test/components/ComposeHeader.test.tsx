import React from "react";
import { ComposeHeader } from "@components";
import {
  fireEvent,
  render,
  toJSON,
  getByText,
} from "@testing-library/react-native";

const setup = (propOverrides = {}) => {
  const props = Object.assign(
    {
      recipientName: "Team A",
    },
    propOverrides
  );
  return {
    ...render(<ComposeHeader {...props} />),
    props,
  };
};

describe("ComposeHeader component", () => {
  it("should match snapshot", () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it("should implement recipientName prop", () => {
    const { getByText } = setup();
    expect(getByText("To: Team A")).toBeDefined();
  });

  it("should update button text when feeling stuck is open", async () => {
    jest.useRealTimers();
    const { queryByText } = setup();
    const button = queryByText("Feeling Stuck?");
    expect(button).toBeTruthy();
    fireEvent.press(button);
    await new Promise((resolve) => setTimeout(resolve, 500)); // await the animation
    expect(button.children[0]).toBe("Collapse");
    fireEvent.press(button);
    await new Promise((resolve) => setTimeout(resolve, 500)); // await the animation
    expect(button.children[0]).toBe("Feeling Stuck?");
  });

  it("should display prompt when open", async () => {
    jest.useRealTimers();
    const { queryByTestId, queryByText } = setup();
    const button = queryByText("Feeling Stuck?");
    let prompt = queryByTestId("prompt");
    expect(prompt).toBeFalsy();
    fireEvent.press(button);
    prompt = queryByTestId("prompt");
    expect(prompt).toBeTruthy();
    await new Promise((resolve) => setTimeout(resolve, 500)); // await the animation
    fireEvent.press(button);
    await new Promise((resolve) => setTimeout(resolve, 500)); // await the animation
    prompt = queryByTestId("prompt");
    expect(prompt).toBeFalsy();
  });
});
