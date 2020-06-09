import React from "react";
import { LoginScreen } from "@views";
import { login } from "@api";
import { render, fireEvent, toJSON } from "@testing-library/react-native";
import fetchMock from "jest-fetch-mock";

jest.mock("@api", () => ({
  login: jest.fn(),
}));

const setup = (response = {}) => {
  const navigation = { navigate: jest.fn() };
  if (Object.keys(response).length > 0) {
    fetchMock.mockOnce(JSON.stringify(response));
  }
  return render(<LoginScreen navigation={navigation} />);
};

describe("Login screen", () => {
  it("should match snapshot", () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });
  it("should make an api call on login", async () => {
    const { getByText, getByTestId } = setup({
      data: {
        id: "6",
        firstName: "Team",
        lastName: "Ameelio",
        email: "team@ameelio.org",
        phone: "4324324432",
        address1: "Somewhere",
        country: "USA",
        postal: "12345",
        city: "New Haven",
        state: "CT",
      },
      type: "success",
    });
    const loginButton = getByText("Login");
    fireEvent.press(getByText("Login"));
    expect(login).toHaveBeenCalledTimes(1);
  });
});
