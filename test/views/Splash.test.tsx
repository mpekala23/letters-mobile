import * as React from "react";
import { SplashScreen } from "@views";
import renderer from "react-test-renderer";
import { Image } from "react-native";

const AmeelioLogo = require("@assets/Ameelio_Logo.png");

describe("Splash screen", () => {
  it("should render", () => {
    const tree = renderer.create(<SplashScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("should show the logo", () => {
    const splash = renderer.create(<SplashScreen />).root;
    const img = splash.findByType(Image);
    expect(img.props.source).toEqual(AmeelioLogo);
  });
});
