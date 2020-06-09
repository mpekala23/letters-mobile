import { Dimensions } from "react-native";
import PropTypes from "prop-types";
import * as EmailValidator from "email-validator";
import PhoneNumber from "awesome-phonenumber";

// Global constants
export const STATUS_BAR_HEIGHT = 20;
export const STATUS_BAR_WIDTH = 100;
export const WINDOW_WIDTH = Dimensions.get("window").width;
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

export enum Validation {
  Email = "Email",
  Phone = "Phone",
  Password = "Password",
  Postal = "Postal",
}

export function isValidEmail(email: string) {
  return EmailValidator.validate(email);
}

export function isValidPhone(phone: string) {
  const pn = new PhoneNumber(phone);
  const pnPlus = new PhoneNumber("+" + phone);
  const pnPlusUs = new PhoneNumber("+1" + phone);
  return pn.isValid() || pnPlus.isValid() || pnPlusUs.isValid();
}

export function isValidPassword(password: string) {
  // at least 8 characters, one uppercase, one lowercase, one number
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
}

export function isValidPostal(zipcode: string) {
  return /^[0-9]{5}(?:-[0-9]{4})?$/.test(zipcode);
}

export function validateFormat(format: Validation, value: string) {
  switch (format) {
    case Validation.Email:
      return isValidEmail(value);
    case Validation.Phone:
      return isValidPhone(value);
    case Validation.Password:
      return isValidPassword(value);
    case Validation.Postal:
      return isValidPostal(value);
    default:
      return false;
  }
}
