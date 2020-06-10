import * as React from "react";
import { ContactInfoScreen } from "@views";
import { render, toJSON, fireEvent } from "@testing-library/react-native";
import { SET_ADDING } from "@store/Contact/ContactTypes";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

const setup = (contactOverrides = {}) => {
  const navigation = { navigate: jest.fn(), addListener: jest.fn() };
  const contact = Object.assign(
    {
      state: "",
      firstName: "",
      lastName: "",
      inmateNumber: "",
      relationship: "",
      facility: null,
    },
    contactOverrides
  );
  const initialState = {
    adding: contact,
    existing: [],
  };
  const store = mockStore({
    contact: initialState,
  });

  const StoreProvider = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return {
    navigation,
    store,
    ...render(
      <ContactInfoScreen navigation={navigation} contactState={initialState} />,
      {
        wrapper: StoreProvider,
      }
    ),
  };
};

describe("Contact Info Screen", () => {
  it("should match snapshot", () => {
    const { container } = setup(<ContactInfoScreen />);
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it("should have next button be disabled until all fields are valid", () => {
    const { navigation, getByPlaceholderText, getByText } = setup();
    const nextButton = getByText("Next");
    fireEvent.press(nextButton);
    expect(
      getByText("Next").parentNode.props.style[1].backgroundColor
    ).toBeDefined();
    expect(navigation.navigate).toHaveBeenCalledTimes(0);
    fireEvent.changeText(getByPlaceholderText("State"), "Minnesota");
    fireEvent.changeText(getByPlaceholderText("First Name"), "First");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "Last");
    fireEvent.changeText(getByPlaceholderText("Inmate Number"), "2");
    fireEvent.changeText(
      getByPlaceholderText("Relationship to Inmate"),
      "Mother"
    );
    fireEvent.press(nextButton);
    expect(getByText("Next").parentNode.props.style[1]).toEqual({});
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });

  it("should dispatch contact info to the redux store when the next button is pressed", () => {
    const { store, getByPlaceholderText, getByText } = setup();
    const nextButton = getByText("Next");
    fireEvent.press(nextButton);
    expect(store.getActions().length).toBe(0);
    fireEvent.changeText(getByPlaceholderText("State"), "Minnesota");
    fireEvent.changeText(getByPlaceholderText("First Name"), "First");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "Last");
    fireEvent.changeText(getByPlaceholderText("Inmate Number"), "2");
    fireEvent.changeText(
      getByPlaceholderText("Relationship to Inmate"),
      "Mother"
    );
    fireEvent.press(nextButton);
    expect(store.getActions().length).toBe(1);
    expect(store.getActions()[0]).toEqual({
      type: SET_ADDING,
      payload: {
        state: "Minnesota",
        firstName: "First",
        lastName: "Last",
        inmateNumber: "2",
        relationship: "Mother",
        facility: null,
      },
    });
  });

  it("should navigate to the facility directory screen when the next button is pressed", () => {
    const { navigation, getByPlaceholderText, getByText } = setup();
    const nextButton = getByText("Next");
    fireEvent.changeText(getByPlaceholderText("State"), "Minnesota");
    fireEvent.changeText(getByPlaceholderText("First Name"), "First");
    fireEvent.changeText(getByPlaceholderText("Last Name"), "Last");
    fireEvent.changeText(getByPlaceholderText("Inmate Number"), "2");
    fireEvent.changeText(
      getByPlaceholderText("Relationship to Inmate"),
      "Mother"
    );
    fireEvent.press(nextButton);
    expect(navigation.navigate).toHaveBeenCalledWith("FacilityDirectory");
  });

  it("should load initial values for fields from the redux store", () => {
    const { getByPlaceholderText } = setup({
      state: "Minnesota",
      firstName: "First",
      lastName: "Last",
      inmateNumber: "6",
      relationship: "Sister",
    });
    expect(getByPlaceholderText("State").props.value).toBe("Minnesota");
    expect(getByPlaceholderText("First Name").props.value).toBe("First");
    expect(getByPlaceholderText("Last Name").props.value).toBe("Last");
    expect(getByPlaceholderText("Inmate Number").props.value).toBe("6");
    expect(getByPlaceholderText("Relationship to Inmate").props.value).toBe(
      "Sister"
    );
  });
});
