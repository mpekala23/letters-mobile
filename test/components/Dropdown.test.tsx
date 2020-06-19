import Dropdown, {
  dropdownInfo,
  dropdownSuccess,
  dropdownWarning,
  dropdownError,
} from "@components/Dropdown/Dropdown.react";
import { Colors } from "@styles";
import { render, toJSON, fireEvent } from "@testing-library/react-native";

jest.useFakeTimers();

const setup = () => {
  return {
    ...render(Dropdown()),
  };
};

describe('Dropdown component', () => {
  it('should match snapshot', () => {
    const { container } = setup();
    const tree = toJSON(container);
    expect(tree).toMatchSnapshot();
  });

  it("should implement success dropdowns", () => {
    const { getByText } = setup();
    dropdownSuccess({ message: "Success" });
    const text = getByText("Success");
    expect(text).toBeDefined();
  });

  it("should implement error dropdowns", () => {
    const { getByText } = setup();
    dropdownError({ message: "Error" });
    const text = getByText("Error");
    expect(text).toBeDefined();
  });

  it('should queue dropdowns', () => {
    const { getByText, queryByText } = setup();
    dropdownError({ message: "thing 1" });
    dropdownError({ message: "thing 2" });
    expect(getByText("thing 1")).toBeDefined();
    expect(queryByText("thing 2")).toBe(null);
  });

  it("should implement onPress", () => {
    const { getByText } = setup();
    const dummy = jest.fn();
    dropdownError({ message: "press me", onPress: dummy });
    fireEvent.press(getByText("press me"));
    expect(dummy).toHaveBeenCalledTimes(1);
  });
});
