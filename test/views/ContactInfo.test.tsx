import * as React from "react";
import { ContactInfo } from "@views";
import { render, toJSON } from "@testing-library/react-native";

const AmeelioLogo = require("@assets/Ameelio_Logo.png");

describe("Splash screen", () => {
  it("should match snapshot", () => {
    const { container } = render(<ContactInfo />);
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });
});
