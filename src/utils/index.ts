import {
  Share,
  Image as ImageComponent,
  Linking,
  Platform,
} from 'react-native';
import * as EmailValidator from 'email-validator';
import PhoneNumber from 'awesome-phonenumber';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { ZipcodeInfo, MailStatus, Image } from 'types';
import i18n from '@i18n';
import * as Segment from 'expo-analytics-segment';
import { addBusinessDays } from 'date-fns';
import Constants from 'expo-constants';
import { createRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import * as StoreReview from 'expo-store-review';
import { popupAlert } from '@components/Alert/Alert.react';
import {
  ABBREV_TO_STATE,
  STATE_TO_ABBREV,
  STATES_DROPDOWN,
  STATE_TO_INMATE_DB,
} from './States';
import { Prompts, getRandomPromptIx } from './FeelingStuck';
import REFERRERS from './Referrers';
import { Screens } from './Screens';
import {
  STATUS_BAR_HEIGHT,
  STATUS_BAR_WIDTH,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  ETA_CREATED_TO_DELIVERED,
  ETA_PROCESSED_TO_DELIVERED,
} from './Constants';

export {
  STATUS_BAR_HEIGHT,
  STATUS_BAR_WIDTH,
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  ETA_CREATED_TO_DELIVERED,
  ETA_PROCESSED_TO_DELIVERED,
};

export { Prompts, getRandomPromptIx };
export { REFERRERS };

export const navigationRef = createRef<NavigationContainerRef>();

export function navigate(name: string, params = {}): void {
  if (navigationRef.current) navigationRef.current.navigate(name, params);
}

export function resetNavigation({
  index,
  routes,
}: {
  index: number;
  routes: { name: string }[];
}): void {
  if (navigationRef.current) {
    navigationRef.current.reset({ index, routes });
  }
}

export async function getCameraPermission(): Promise<
  ImagePicker.PermissionStatus
> {
  const { status } = await Permissions.askAsync(Permissions.CAMERA);
  return status;
}

export async function getCameraRollPermission(): Promise<
  ImagePicker.PermissionStatus
> {
  const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  return status;
}

export async function takeImage(
  {
    aspect,
    allowsEditing,
  }: { allowsEditing: boolean; aspect: [number, number] } = {
    allowsEditing: true,
    aspect: [3, 3],
  }
): Promise<null | ImageInfo> {
  let cameraStatus = (await ImagePicker.getCameraPermissionsAsync()).status;
  if (cameraStatus !== 'granted') {
    cameraStatus = (await Permissions.askAsync(Permissions.CAMERA)).status;
  }
  if (cameraStatus !== 'granted') throw Error('Need permission');
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing,
    aspect,
    quality: 1,
    exif: true,
  });
  if (result.cancelled) {
    return null;
  }
  return result;
}

export async function pickImage(
  {
    aspect,
    allowsEditing,
  }: { allowsEditing: boolean; aspect: [number, number] } = {
    allowsEditing: true,
    aspect: [3, 3],
  }
): Promise<null | ImageInfo> {
  let libraryStatus = (await ImagePicker.getCameraRollPermissionsAsync())
    .status;
  if (libraryStatus !== 'granted') {
    libraryStatus = (await Permissions.askAsync(Permissions.CAMERA_ROLL))
      .status;
  }
  if (libraryStatus !== 'granted') throw Error('Need permission');
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing,
    aspect,
    quality: 1,
    exif: true,
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
  InternationalPostal = 'InternationalPostal',
  CreditCard = 'CreditCard',
  InmateNumber = 'InmateNumber',
  Address = 'Address',
  City = 'City',
  State = 'State',
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
  return password.length >= 8;
}

export function isValidPostal(postal: string): boolean {
  return /^[0-9]{5}(?:-[0-9]{4})?$/.test(postal);
}

export function isValidInternationalPostal(postal: string): boolean {
  return postal.length > 0;
}

export function isValidCreditCard(card: string): boolean {
  return /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(
    card
  );
}

export function isValidInmateNumber(number: string): boolean {
  return number.length > 0;
}

export function isValidAddress(address: string): boolean {
  return /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9'.-\s,#"‘’“”]*$/.test(address);
}

export function isValidCity(city: string): boolean {
  return /^[a-zA-ZÀ-ÖØ-öø-ÿ.-\s]*$/.test(city);
}

export function isValidState(state: string): boolean {
  return state.length > 0;
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
    case Validation.InternationalPostal:
      return isValidInternationalPostal(value);
    case Validation.CreditCard:
      return isValidCreditCard(value);
    case Validation.InmateNumber:
      return isValidInmateNumber(value);
    case Validation.Address:
      return isValidAddress(value);
    case Validation.City:
      return isValidCity(value);
    case Validation.State:
      return isValidState(value);
    default:
      return false;
  }
}

export const LOB_NAME_CHAR_LIMIT = 28; // excluding spaces

export {
  ABBREV_TO_STATE,
  STATE_TO_ABBREV,
  STATES_DROPDOWN,
  STATE_TO_INMATE_DB,
};

export function sleep(ms: number, error = false): Promise<void> {
  return new Promise((resolve, reject) =>
    setTimeout(() => {
      if (error) reject();
      else resolve();
    }, ms)
  );
}

export function haversine(loc1: ZipcodeInfo, loc2: ZipcodeInfo): number {
  if (!loc1.lat || !loc1.long || !loc2.lat || !loc2.long) return 0;
  const R = 6371e3;
  const φ1 = (loc1.lat * Math.PI) / 180;
  const φ2 = (loc2.lat * Math.PI) / 180;
  const Δφ = ((loc2.lat - loc1.lat) * Math.PI) / 180;
  const Δλ = ((loc2.long - loc1.long) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 0.000621371);
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function estimateDelivery(date: Date, status?: MailStatus): Date {
  if (status === MailStatus.ProcessedForDelivery) {
    return addBusinessDays(date, ETA_PROCESSED_TO_DELIVERED);
  }
  return addBusinessDays(date, ETA_CREATED_TO_DELIVERED);
}

export const RELEASE_CHANNEL = Constants.manifest.releaseChannel;

export function isProduction(): boolean {
  if (!RELEASE_CHANNEL) return false;
  return RELEASE_CHANNEL.indexOf('prod') !== -1;
}

export const onNativeShare = async (
  screen: Screens,
  cta: string,
  referralCode?: string
): Promise<void> => {
  const PROPERTIES = { screen, cta };

  Segment.trackWithProperties('Share - Click on Share Button', {
    ...PROPERTIES,
  });

  try {
    const link = referralCode
      ? `https://ameelio.org/#/join/${referralCode}`
      : 'https://ameelio.org/#/';
    const result = await Share.share(
      {
        message: `${i18n.t('Sharing.message')}${' '}${link}`,
        title: i18n.t('Sharing.title'),
      },
      {
        subject: i18n.t('Sharing.subjectLine'),
        dialogTitle: i18n.t('Sharing.title'),
      }
    );
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        Segment.trackWithProperties('Share - Success', {
          ...PROPERTIES,
          activityType: result.activityType,
          action: result.action,
        });
      } else {
        Segment.trackWithProperties('Share - Success', {
          ...PROPERTIES,
          action: result.action,
        });
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
      Segment.trackWithProperties('Share - Dismissed', {
        ...PROPERTIES,
      });
    }
  } catch (error) {
    Segment.trackWithProperties('Share - Error', {
      ...PROPERTIES,
      error: error.message,
    });
  }
};

export function getNumWords(content: string): number {
  let s = content;
  s = s.replace(/\n/g, ' '); // newlines to space
  s = s.replace(/(^\s*)|(\s*$)/gi, ''); // remove spaces from start + end
  s = s.replace(/[ ]{2,}/gi, ' '); // 2 or more spaces to 1
  const split = s.split(' ');
  let numWords = split.length;
  if (split[0] === '') {
    numWords = 0;
  }
  return numWords;
}

export function getImageDims(
  uri: string
): Promise<{ width: number; height: number }> {
  return new Promise((res, rej) => {
    ImageComponent.getSize(
      uri,
      (width, height) => {
        res({ width, height });
      },
      rej
    );
  });
}

export function distance(
  p1: { x: number; y: number },
  p2: { x: number; y: number }
): number {
  return Math.sqrt(
    (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y)
  );
}

export function getAspectRatio(image: Image): number {
  return image.width && image.height ? image.width / image.height : 1;
}

export async function requestReview(): Promise<void> {
  if (Platform.OS === 'ios') {
    if (await StoreReview.hasAction()) {
      await StoreReview.requestReview();
    }
  } else {
    popupAlert({
      title: i18n.t('ReviewApp.title'),
      message: i18n.t('ReviewApp.message'),
      buttons: [
        {
          text: i18n.t('ReviewApp.takeMeToPlayStore'),
          onPress: () => {
            const url = StoreReview.storeUrl();
            Linking.openURL(url || '');
          },
        },
        {
          text: i18n.t('ReviewApp.noThanks'),
          reverse: true,
        },
      ],
    });
  }
}
