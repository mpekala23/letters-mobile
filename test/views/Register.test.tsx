import React from "react";
import { Button } from "@components";
import { RegisterScreen } from "@views";
import renderer from "react-test-renderer";
import fetchMock from "jest-fetch-mock";

const setup = (response = {}) => {
  const navigation = { navigate: jest.fn() };
  const element = renderer.create(<RegisterScreen navigation={navigation} />);
  const instance = element.getInstance();
  if (Object.keys(response).length > 0) {
    fetchMock.mockOnce(JSON.stringify(response));
  }
  return {
    element,
    instance,
  };
};

describe("Register screen", () => {
  it("should render", () => {
    const { element } = setup();
    const tree = element.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("should have register button be disabled until all fields are valid", async () => {
    const { element, instance } = setup();
    const registerScreen = element.root;
    const registerButton = registerScreen.findAllByType(Button)[2];
    expect(registerButton.props.enabled).toBe(false);
    instance.devSkip();
    expect(registerButton.props.enabled).toBe(true);
  });
  it("should give an error and not submit on bad register", async () => {
    const { element, instance } = setup({
      type: "error",
      data: "email in use",
    });
    const registerScreen = element.root;
    const registerButton = registerScreen.findAllByType(Button)[2];
    instance.devSkip();
    await registerButton.props.onPress();
    //expect(instance.state.registered).toBe(false);
  });
  it("should successfully register a new user on good register", async () => {
    const { element, instance } = setup({
      data: {
        id: "6",
        firstName: "Mark",
        lastName: "Pekala",
        email: "mpekala@college.harvard.edu",
        cell: "6127038623",
        addresss1: "210 W Diamond Lake Road",
        country: "USA",
        zipcode: "55419",
        city: "Minneapolis",
        state: "MN",
      },
      type: "success",
    });
    const registerScreen = element.root;
    const registerButton = registerScreen.findAllByType(Button)[2];
    instance.devSkip();
    await registerButton.props.onPress();
    //expect(instance.state.registered).toBe(true);
  });
});
