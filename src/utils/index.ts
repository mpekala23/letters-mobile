import { Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import * as EmailValidator from 'email-validator';
import PhoneNumber from 'awesome-phonenumber';
import { STATES, STATES_DROPDOWN } from './States';

// Global constants
export const STATUS_BAR_HEIGHT = 20;
export const STATUS_BAR_WIDTH = 100;
export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;

/** A custom function to validate the type of an object passed for styling.
 *  Accepts any object of strings and numbers,
 * to avoid having to enumerate all possible styles that can be applied. */
export const StyleType = PropTypes.objectOf(
  (propValue, key, componentName, location, propFullName): Error | null => {
    if (
      typeof propValue[key] !== 'string' &&
      typeof propValue[key] !== 'number'
    ) {
      return new Error(
        `Invalid prop \`${propFullName}\` supplied to` +
          ` \`${componentName}\`. Validation failed.`
      );
    }
    return null;
  }
);

export enum Validation {
  Email = 'Email',
  Phone = 'Phone',
  Password = 'Password',
  Postal = 'Postal',
  State = 'State',
  CreditCard = 'CreditCard',
}

export function isValidEmail(email: string): boolean {
  return EmailValidator.validate(email);
}

export function isValidPhone(phone: string): boolean {
  const pn = new PhoneNumber(phone);
  const pnPlus = new PhoneNumber(`+${phone}`);
  const pnPlusUs = new PhoneNumber(`+1${phone}`);
  return pn.isValid() || pnPlus.isValid() || pnPlusUs.isValid();
}

export function isValidPassword(password: string): boolean {
  // at least 8 characters, one uppercase, one lowercase, one number
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
}

export function isValidPostal(postal: string): boolean {
  return /^[0-9]{5}(?:-[0-9]{4})?$/.test(postal);
}

export function isValidState(state: string): boolean {
  return Object.values(STATES).indexOf(state) > -1;
}

export function isValidCreditCard(card: string): boolean {
  return /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(
    card
  );
}

export function validateFormat(format: Validation, value: string): boolean {
  switch (format) {
    case Validation.Email:
      return isValidEmail(value);
    case Validation.Phone:
      return isValidPhone(value);
    case Validation.Password:
      return isValidPassword(value);
    case Validation.Postal:
      return isValidPostal(value);
    case Validation.State:
      return isValidState(value);
    case Validation.CreditCard:
      return isValidCreditCard(value);
    default:
      return false;
  }
}

export { STATES, STATES_DROPDOWN };
