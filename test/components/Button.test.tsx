import React from "react";
import { Button } from "@components";
import renderer from "react-test-renderer";
import Enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

Enzyme.configure({ adapter: new Adapter() });

test("renders correctly", () => {
  const tree = renderer
    .create(
      <Button
        containerStyle={{ backgroundColor: "white" }}
        textStyle={{ fontSize: 10 }}
        buttonText="Button"
        onPress={() => {}}
      />
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
