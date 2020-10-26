import { Animated } from 'react-native';
import {
  BUTTONS_HIDDEN,
  BUTTONS_SHOWN,
  BUTTON_SLIDE_DURATION,
  FLIPPED,
  FLIP_DURATION,
  KEYBOARD_DURATION,
  KEYBOARD_HIDDEN,
  KEYBOARD_OPEN,
  TRAY_CLOSED,
  TRAY_OPEN,
  TRAY_SLIDE_DURATION,
  UNFLIPPED,
} from './Constants';

export function openTray(
  value: Animated.Value,
  callback?: () => void,
  overrides?: { toValue?: number; duration?: number; useNativeDriver?: boolean }
): void {
  Animated.timing(value, {
    toValue: TRAY_OPEN,
    duration: TRAY_SLIDE_DURATION,
    useNativeDriver: false,
    ...overrides,
  }).start(callback);
}

export function closeTray(
  value: Animated.Value,
  callback?: () => void,
  overrides?: { toValue?: number; duration?: number; useNativeDriver?: boolean }
): void {
  Animated.timing(value, {
    toValue: TRAY_CLOSED,
    duration: TRAY_SLIDE_DURATION,
    useNativeDriver: false,
    ...overrides,
  }).start(callback);
}

export function showButtons(
  value: Animated.Value,
  callback?: () => void,
  overrides?: { toValue?: number; duration?: number; useNativeDriver?: boolean }
): void {
  Animated.timing(value, {
    toValue: BUTTONS_SHOWN,
    duration: BUTTON_SLIDE_DURATION,
    useNativeDriver: false,
    ...overrides,
  }).start(callback);
}

export function hideButtons(
  value: Animated.Value,
  callback?: () => void,
  overrides?: { toValue?: number; duration?: number; useNativeDriver?: boolean }
): void {
  Animated.timing(value, {
    toValue: BUTTONS_HIDDEN,
    duration: BUTTON_SLIDE_DURATION,
    useNativeDriver: false,
    ...overrides,
  }).start(callback);
}

export function flip(
  value: Animated.Value,
  callback?: () => void,
  overrides?: { toValue?: number; duration?: number; useNativeDriver?: boolean }
): void {
  Animated.timing(value, {
    toValue: FLIPPED,
    duration: FLIP_DURATION,
    useNativeDriver: false,
    ...overrides,
  }).start(callback);
}

export function unflip(
  value: Animated.Value,
  callback?: () => void,
  overrides?: { toValue?: number; duration?: number; useNativeDriver?: boolean }
): void {
  Animated.timing(value, {
    toValue: UNFLIPPED,
    duration: FLIP_DURATION,
    useNativeDriver: false,
    ...overrides,
  }).start(callback);
}

export function showKeyboardItem(
  value: Animated.Value,
  callback?: () => void,
  overrides?: { toValue?: number; duration?: number; useNativeDriver?: boolean }
): void {
  Animated.timing(value, {
    toValue: KEYBOARD_OPEN,
    duration: KEYBOARD_DURATION,
    useNativeDriver: false,
    ...overrides,
  }).start(callback);
}

export function hideKeyboardItem(
  value: Animated.Value,
  callback?: () => void,
  overrides?: { toValue?: number; duration?: number; useNativeDriver?: boolean }
): void {
  Animated.timing(value, {
    toValue: KEYBOARD_HIDDEN,
    duration: KEYBOARD_DURATION,
    useNativeDriver: false,
    ...overrides,
  }).start(callback);
}

export {
  TRAY_CLOSED,
  TRAY_OPEN,
  TRAY_SLIDE_DURATION,
  BUTTONS_HIDDEN,
  BUTTONS_SHOWN,
  BUTTON_SLIDE_DURATION,
  UNFLIPPED,
  FLIPPED,
  FLIP_DURATION,
};
