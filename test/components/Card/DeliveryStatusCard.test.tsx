import React from "react";
import { DeliveryStatusCard } from "@components";
import { fireEvent, render, toJSON } from "@testing-library/react-native";
import { LetterStatus } from "types";

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

  it("should display progress bar 0 / 5", () => {
    const { getByTestId } = setup({ status: LetterStatus.Draft });
    expect(getByTestId("progressBar").props.style[1].width).toBe("0%");
  });

  it("should display progress bar 1 / 5", () => {
    const { getByTestId } = setup({ status: LetterStatus.Created });
    expect(getByTestId("progressBar").props.style[1].width).toBe("20%");
  });

  it("should display progress bar 2 / 5", () => {
    const { getByTestId } = setup({ status: LetterStatus.Printed });
    expect(getByTestId("progressBar").props.style[1].width).toBe("40%");
  });

  it("should display progress bar 3 / 5", () => {
    const { getByTestId } = setup({ status: LetterStatus.Mailed });
    expect(getByTestId("progressBar").props.style[1].width).toBe("60%");
  });

  it("should display progress bar 4 / 5", () => {
    const { getByTestId } = setup({
      status: LetterStatus.OutForDelivery,
    });
    expect(getByTestId("progressBar").props.style[1].width).toBe("80%");
  });

  it("should display progress bar 5 / 5", () => {
    const { getByTestId } = setup({ status: LetterStatus.Delivered });
    expect(getByTestId("progressBar").props.style[1].width).toBe("100%");
  });
});
