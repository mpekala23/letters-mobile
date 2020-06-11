import React from "react";
import { ThanksScreen } from "@views";
import { render, fireEvent, toJSON } from "@testing-library/react-native";

const setup = () => {
  const navigation = { navigate: jest.fn() };
  return {
    navigation,
    ...render(<ThanksScreen navigation={navigation} />),
  };
};

describe("Thanks screen", () => {
  it("should match snapshot", () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });
  it("should navigate to home screen when button is pressed", async () => {
    const { navigation, getByText } = setup();
    const homeButton = getByText("Return home");
    fireEvent.press(homeButton);
    expect(navigation.navigate).toHaveBeenCalledWith("Home");
  });
});
