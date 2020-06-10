import * as React from "react";
import { ReviewContactScreen } from "@views";
import { render, toJSON, fireEvent } from "@testing-library/react-native";
import { SET_ADDING } from "@store/Contact/ContactTypes";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

const mockStore = configureStore([]);

const setup = (contactOverrides = {}) => {
  const navigation = { navigate: jest.fn(), addListener: jest.fn() };
  const contact = Object.assign(
    {
      state: "MN",
      firstName: "First",
      lastName: "Last",
      inmateNumber: "6",
      relationship: "Brother",
      facility: {
        address: "Address",
        city: "City",
        name: "Facility Name",
        postal: "23232",
        state: "MN",
        type: "State Prison",
      },
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
      <ReviewContactScreen
        navigation={navigation}
        contactState={initialState}
      />,
      {
        wrapper: StoreProvider,
      }
    ),
  };
};

describe("Review Contact Screen", () => {
  it("should match snapshot", () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it("should have next button be enabled only when all fields are valid", () => {
    const { navigation, getByPlaceholderText, getByText } = setup();
    const addButton = getByText("Add Contact");
    expect(addButton.parentNode.props.style[1]).toEqual({});
    fireEvent.changeText(getByPlaceholderText("State"), "");
    expect(addButton.parentNode.props.style[1].backgroundColor).toBeDefined();
  });

  it("should load initial values for fields from the redux store", () => {
    const { getByPlaceholderText } = setup({
      state: "AK",
      firstName: "First test",
      lastName: "Last test",
      inmateNumber: "8",
      relationship: "Brother",
    });
    expect(getByPlaceholderText("State").props.value).toBe("AK");
    expect(getByPlaceholderText("First Name").props.value).toBe("First test");
    expect(getByPlaceholderText("Last Name").props.value).toBe("Last test");
  });

  it("should navigate to the facility directory screen when the back button is pressed", () => {
    const { navigation, getByText } = setup();
    fireEvent.press(getByText("Back"));
    expect(navigation.navigate).toHaveBeenCalledWith("FacilityDirectory");
  });
});
