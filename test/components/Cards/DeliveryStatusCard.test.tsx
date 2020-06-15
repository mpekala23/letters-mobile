import React from "react";
import { DeliveryStatusCard } from "@components";
import { fireEvent, render, toJSON } from "@testing-library/react-native";

const setup = (propOverrides = {}) => {
  const props = Object.assign(
    {
      title: "Title",
      status: "Status",
      date: "Date",
      progress: 0,
      onPress: jest.fn(),
    },
    propOverrides
  );
  return {
    ...render(<DeliveryStatusCard {...props} />),
    props,
  };
};

describe("Delivery Status Card component", () => {
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

  it("should display status", () => {
    const { getByText } = setup();
    expect(getByText("Status")).toBeDefined();
  });

  it("should display date", () => {
    const { getByText } = setup();
    expect(getByText("Date")).toBeDefined();
  });

  it("should display progress bar 0 / 4", () => {
    const { getByTestId } = setup();
    expect(getByTestId("progressBar").props.style[1].width).toBe("0%");
  });

  it("should display progress bar 1 / 4", () => {
    const { getByTestId } = setup({ progress: 1 });
    expect(getByTestId("progressBar").props.style[1].width).toBe("25%");
  });

  it("should display progress bar 2 / 4", () => {
    const { getByTestId } = setup({ progress: 2 });
    expect(getByTestId("progressBar").props.style[1].width).toBe("50%");
  });

  it("should display progress bar 3 / 4", () => {
    const { getByTestId } = setup({ progress: 3 });
    expect(getByTestId("progressBar").props.style[1].width).toBe("75%");
  });

  it("should display progress bar 4 / 4", () => {
    const { getByTestId } = setup({ progress: 4 });
    expect(getByTestId("progressBar").props.style[1].width).toBe("100%");
  });
});
