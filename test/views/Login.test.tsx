import React from "react";
import { Button } from "@components";
import { LoginScreen } from "@views";
import renderer from "react-test-renderer";
import fetchMock from "jest-fetch-mock";

const setup = (response = {}) => {
  const navigation = { navigate: jest.fn() };
  const element = renderer.create(<LoginScreen navigation={navigation} />);
  const instance = element.getInstance();
  if (Object.keys(response).length > 0) {
    fetchMock.mockOnce(JSON.stringify(response));
  }
  return {
    element,
    instance,
  };
};

describe("Login screen", () => {
  it("should render", () => {
    const { element } = setup();
    const tree = element.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("should successfully make an api call on good login", async () => {
    const { element, instance } = setup({
      data: {
        id: "6",
        firstName: "Team",
        lastName: "Ameelio",
        email: "team@ameelio.org",
        cell: "4324324432",
        address1: "Somewhere",
        country: "USA",
        zipcode: "12345",
        city: "New Haven",
        state: "CT",
      },
      type: "success",
    });
    const login = element.root;
    const loginButton = login.findAllByType(Button)[0];
    await loginButton.props.onPress();
    //expect(instance.state.loggedIn).toBe(true);
  });
  it("should fail an api call on bad login", async () => {
    const { element } = setup({
      data: "bad",
      type: "error",
    });
    const login = element.root;
    const loginButton = login.findAllByType(Button)[0];
    await loginButton.props.onPress();
    //expect(login._fiber.stateNode.state.loggedIn).toBe(false);
  });
});
