import React from "react";
import { ProfilePic } from "@components";
import renderer from "react-test-renderer";
import Enzyme, { shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { UserState } from "@store/User/UserTypes";
import { Colors } from "@styles";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

Enzyme.configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

const setupShallow = (authOverrides) => {
  const authInfo = Object.assign(
    {
      isLoadingToken: true,
      isLoggedIn: false,
      userToken: "",
    },
    authOverrides
  );
  const store = mockStore({
    userState: {
      authInfo,
      user: {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        cell: "",
        address1: "",
        address2: "",
        country: "",
        zipcode: "",
        city: "",
        state: "",
      },
    },
  });

  const wrapper = shallow(
    <Provider store={store}>
      <ProfilePic />
    </Provider>
  );

  return {
    store,
    wrapper,
  };
};

const setupInstance = (authOverrides, userOverrides) => {
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
  const instance = element.getInstance();

  return {
    store,
    element,
    instance,
  };
};

describe("ProfilePic component", () => {
  test("renders", () => {
    const { wrapper } = setupShallow();
    expect(wrapper).toMatchSnapshot();
  });
  test("blank when user is logged out", () => {
    const { element, store } = setupInstance();
    const profilePic = element.root;
    const view = profilePic.findByType(View);
    expect(view).toBeDefined();
  });
  test("initials when user is logged in without picture", () => {
    const { element, store } = setupInstance({ isLoggedIn: true });
    const profilePic = element.root;
    const text = profilePic.findByType(Text);
    expect(text).toBeDefined();
    expect(text.props.children).toEqual("TA");
  });
  test("image when user is logged in with picture", () => {
    const { element, store } = setupInstance(
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
