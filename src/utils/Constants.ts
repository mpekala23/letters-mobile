import { Dimensions } from 'react-native';

// Global constants
export const STATUS_BAR_HEIGHT = 25;
export const STATUS_BAR_WIDTH = 100;
export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;
export const ETA_CREATED_TO_DELIVERED = 6;
export const ETA_PROCESSED_TO_DELIVERED = 3;
export const BAR_HEIGHT = 80;

// Compose constants
export const POSTCARD_WIDTH = WINDOW_WIDTH - 32;
export const POSTCARD_HEIGHT = POSTCARD_WIDTH * (2 / 3);
export const PERSONAL_OVERRIDE_ID = -6;
