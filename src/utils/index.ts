import { Dimensions } from 'react-native';
import * as EmailValidator from 'email-validator';
import PhoneNumber from 'awesome-phonenumber';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { STATES, STATES_DROPDOWN } from './States';
import { Prompts, getRandomPromptIx } from './FeelingStuck';

export { Prompts, getRandomPromptIx };

// Global constants
export const STATUS_BAR_HEIGHT = 20;
export const STATUS_BAR_WIDTH = 100;
export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;

export async function getCameraRollPermission(): Promise<
  ImagePicker.PermissionStatus
> {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  return status;
}

export async function pickImage(): Promise<null | ImageInfo> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [3, 3],
    quality: 1,
  });
  if (result.cancelled) {
    return null;
  }
  return result;
}

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
