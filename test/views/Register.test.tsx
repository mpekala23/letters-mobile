import React from "react";
import { Button } from "@components";
import { RegisterScreen } from "@views";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import fetchMock from "jest-fetch-mock";

Enzyme.configure({ adapter: new Adapter() });
jest.useFakeTimers();

const setupShallow = () => {
  const navigation = { navigate: jest.fn() };
  const wrapper = shallow(<RegisterScreen navigation={navigation} />);
  return {
    wrapper,
  };
};

const setupBlankInstance = () => {
  const navigation = { navigate: jest.fn() };
  const element = renderer.create(<RegisterScreen navigation={navigation} />);
  const instance = element.getInstance();
  return {
    element,
    instance,
  };
};

const setupInstance = (response) => {
  const navigation = { navigate: jest.fn() };
  const element = renderer.create(<RegisterScreen navigation={navigation} />);
  const instance = element.getInstance();
  fetchMock.mockOnce(JSON.stringify(response));
  return {
    element,
    instance,
  };
};

describe("Register screen", () => {
  test("renders", () => {
    const { wrapper } = setupShallow();
    expect(wrapper).toMatchSnapshot();
  });
  test("register disabled until all fields valid", async () => {
    const { element } = setupBlankInstance();
    const registerScreen = element.root;
    const registerButton = registerScreen.findAllByType(Button)[2];
    expect(registerButton.props.enabled).toBe(false);
    registerScreen._fiber.stateNode.devSkip();
    expect(registerButton.props.enabled).toBe(true);
  });
  test("error registration", async () => {
    const { element } = setupInstance({
      type: "error",
      data: "email in use",
    });
    const registerScreen = element.root;
    const registerButton = registerScreen.findAllByType(Button)[2];
    registerScreen._fiber.stateNode.devSkip();
    await registerButton.props.onPress();
    expect(registerScreen._fiber.stateNode.state.registered).toBe(false);
  });
  test("successful registration", async () => {
    const { element } = setupInstance({
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
    registerScreen._fiber.stateNode.devSkip();
    await registerButton.props.onPress();
    expect(registerScreen._fiber.stateNode.state.registered).toBe(true);
  });
});
