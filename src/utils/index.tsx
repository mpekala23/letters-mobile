import { Dimensions } from "react-native";
import PropTypes from "prop-types";

// Global constants
export const STATUS_BAR_HEIGHT = 25;
export const STATUS_BAR_WIDTH = 100;
export const WINDOW_WIDTHr = Dimensions.get("window").width;
export const WINDOW_HEIGHT = Dimensions.get("window").height;

/** A custom function to validate the type of an object passed for styling.
 *  Accepts any object of strings and numbers,
 * to avoid having to enumerate all possible styles that can be applied. */
export const StyleType = PropTypes.objectOf(
  (propValue, key, componentName, location, propFullName): Error | null => {
    if (
      typeof propValue[key] !== "string" &&
      typeof propValue[key] !== "number"
    ) {
      return new Error(
        "Invalid prop `" +
          propFullName +
          "` supplied to" +
          " `" +
          componentName +
          "`. Validation failed."
      );
    }
    return null;
  }
);
