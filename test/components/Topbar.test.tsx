import React from "react";
import { ProfilePic } from "@components";
import renderer from "react-test-renderer";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

const setup = () => {
  const authInfo = {
    isLoadingToken: true,
    isLoggedIn: false,
    userToken: "",
  };
  const user = {
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
  };
  const store = mockStore({
    user: {
      authInfo,
      user,
    },
  });

  const element = renderer.create(
    <Provider store={store}>
      <ProfilePic />
    </Provider>
  );

  return {
    store,
    element,
  };
};

describe("Topbar component", () => {
  it("should render", () => {
    const { element } = setup();
    const tree = element.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
