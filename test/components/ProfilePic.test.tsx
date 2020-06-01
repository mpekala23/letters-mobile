import React from "react";
import { ProfilePic } from "@components";
import renderer from "react-test-renderer";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

const setup = (authOverrides = {}, userOverrides = {}) => {
  const authInfo = Object.assign(
    {
      isLoadingToken: true,
      isLoggedIn: false,
      userToken: "",
    },
    authOverrides
  );
  const user = Object.assign(
    {
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
    userOverrides
  );
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

describe("ProfilePic component", () => {
  it("should render", () => {
    const { element } = setup();
    const tree = element.toJSON();
    expect(tree).toMatchSnapshot();
  });
  it("should be blank when user is logged out", () => {
    const { element } = setup();
    const profilePic = element.root;
    const view = profilePic.findByType(View);
    expect(view).toBeDefined();
  });
  it("should display initials when a user is logged in without a profile picture", () => {
    const { element } = setup({ isLoggedIn: true });
    const profilePic = element.root;
    const text = profilePic.findByType(Text);
    expect(text).toBeDefined();
    expect(text.props.children).toEqual("TA");
  });
  it("should show an image when a user is logged in with a profile picture", () => {
    const { element } = setup(
      {
        isLoggedIn: true,
      },
      { imageUri: "placeholder" }
    );
    const profilePic = element.root;
    const image = profilePic.findByType(Image);
    expect(image).toBeDefined();
  });
});
