import * as React from "react";
import { SplashScreen } from "@views";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

const AmeelioLogo = require("@assets/Ameelio_Logo.png");

Enzyme.configure({ adapter: new Adapter() });

describe("splash screen", () => {
  test("displays whole screen", () => {
    const tree = renderer.create(<SplashScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  test("renders logo", () => {
    const splash = shallow(<SplashScreen />);
    const renderedPath = splash.find("Image").prop("source").testUri;
    const actualPath = AmeelioLogo.testUri;
    expect(renderedPath).toEqual(actualPath);
  });
});
