import * as React from "react";
import { AddManuallyScreen } from "@views";
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
      <AddManuallyScreen navigation={navigation} contactState={initialState} />,
      {
        wrapper: StoreProvider,
      }
    ),
  };
};

describe("Add Manually Screen", () => {
  it("should match snapshot", () => {
    const { container } = setup();
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
    fireEvent.changeText(
      getByPlaceholderText("Facility Name"),
      "Facility Name"
    );
    fireEvent.changeText(getByPlaceholderText("Facility Address"), "Address");
    fireEvent.changeText(getByPlaceholderText("Facility City"), "City");
    fireEvent.changeText(getByPlaceholderText("Facility Postal"), "23232");
    fireEvent.press(nextButton);
    expect(getByText("Next").parentNode.props.style[1]).toEqual({});
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
  });

  it("should navigate to the facility directory screen with data when the next button is pressed", () => {
    const { navigation, getByPlaceholderText, getByText } = setup();
    const nextButton = getByText("Next");
    fireEvent.changeText(
      getByPlaceholderText("Facility Name"),
      "Facility Name"
    );
    fireEvent.changeText(getByPlaceholderText("Facility Address"), "Address");
    fireEvent.changeText(getByPlaceholderText("Facility City"), "City");
    fireEvent.changeText(getByPlaceholderText("Facility Postal"), "23232");
    fireEvent.press(nextButton);
    expect(navigation.navigate).toHaveBeenCalledWith("FacilityDirectory", {
      newFacility: {
        address: "Address",
        city: "City",
        name: "Facility Name",
        postal: "23232",
        state: "MN",
        type: "State Prison",
      },
    });
  });

  it("should navigate to the facility directory screen when the back button is pressed", () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText("Back"));
    expect(navigation.navigate).toHaveBeenCalledWith("FacilityDirectory");
  });
});
