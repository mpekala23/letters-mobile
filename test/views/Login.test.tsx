import React from "react";
import { Button } from "@components";
import { LoginScreen } from "@views";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import fetchMock from "jest-fetch-mock";

Enzyme.configure({ adapter: new Adapter() });
jest.useFakeTimers();

const setupShallow = () => {
  const navigation = { navigate: jest.fn() };
  const wrapper = shallow(<LoginScreen navigation={navigation} />);
  return {
    wrapper,
  };
};

const setupInstance = (response) => {
  const navigation = { navigate: jest.fn() };
  const element = renderer.create(<LoginScreen navigation={navigation} />);
  const instance = element.getInstance();
  fetchMock.mockOnce(JSON.stringify(response));
  return {
    element,
    instance,
  };
};

describe("Login screen", () => {
  test("renders", () => {
    const { wrapper } = setupShallow();
    expect(wrapper).toMatchSnapshot();
  });
  test("makes successfully api call on successful login press", async () => {
    const { element } = setupInstance({
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
    expect(login._fiber.stateNode.state.loggedIn).toBe(true);
  });
  test("makes failure api call on failure login press", async () => {
    const { element } = setupInstance({
      data: "bad",
      type: "error",
    });
    const login = element.root;
    const loginButton = login.findAllByType(Button)[0];
    await loginButton.props.onPress();
    expect(login._fiber.stateNode.state.loggedIn).toBe(false);
  });
});
