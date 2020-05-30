import React from "react";
import { Topbar } from "@components";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

const setupShallow = () => {
  const wrapper = shallow(<Topbar />);

  return {
    wrapper,
  };
};

describe("Topbar component", () => {
  test("renders", () => {
    const { wrapper } = setupShallow();
    expect(wrapper).toMatchSnapshot();
  });
});
