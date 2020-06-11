import React from "react";
import { IssuesScreen } from "@views";
import { render, fireEvent, toJSON } from "@testing-library/react-native";

const setup = () => {
  const navigation = { navigate: jest.fn() };
  return {
    navigation,
    ...render(<IssuesScreen navigation={navigation} />),
  };
};

describe("Issues screen", () => {
  it("should match snapshot", () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });
  it("should navigate to thanks screen when wasn't received issue pressed", async () => {
    const { navigation, getByText } = setup();
    const receivedButton = getByText("Letter wasn't received");
    fireEvent.press(receivedButton);
    const reportButton = getByText("Report the problem");
    fireEvent.press(reportButton);
    expect(navigation.navigate).toHaveBeenCalledWith("Thanks");
  });
  it("should navigate to thanks screen when delayed issue pressed", async () => {
    const { navigation, getByText } = setup();
    const delayedButton = getByText("Letter was delayed");
    fireEvent.press(delayedButton);
    const reportButton = getByText("Report the problem");
    fireEvent.press(reportButton);
    expect(navigation.navigate).toHaveBeenCalledWith("Thanks");
  });
  it("should navigate to explain problem screen when other pressed", async () => {
    const { navigation, getByText } = setup();
    const otherButton = getByText("Other");
    fireEvent.press(otherButton);
    const reportButton = getByText("Report the problem");
    fireEvent.press(reportButton);
    expect(navigation.navigate).toHaveBeenCalledWith("ExplainProblem");
  });
});
