import i18n from '@i18n';
import { PostcardSizeOption, PostcardSize } from 'types';
import { Dimensions } from 'react-native';
import SmallPostcard from '@assets/views/Compose/PostcardSizes/Small.png';
import MediumPostcard from '@assets/views/Compose/PostcardSizes/Medium.png';
import LargePostcard from '@assets/views/Compose/PostcardSizes/Large.png';

// Global constants
export const STATUS_BAR_HEIGHT = 25;
export const STATUS_BAR_WIDTH = 100;
export const WINDOW_WIDTH = Dimensions.get('window').width;
export const WINDOW_HEIGHT = Dimensions.get('window').height;
export const ETA_CREATED_TO_DELIVERED = 6;
export const ETA_PROCESSED_TO_DELIVERED = 1;
export const BAR_HEIGHT = 64;

// Compose constants
export const POSTCARD_WIDTH = WINDOW_WIDTH - 32;
export const POSTCARD_HEIGHT = POSTCARD_WIDTH * (2 / 3);
export const PERSONAL_OVERRIDE_ID = -6;
export const DESIGN_BUTTONS_HEIGHT = 200;
export const BOTTOM_HEIGHT =
  WINDOW_HEIGHT - POSTCARD_HEIGHT - BAR_HEIGHT - STATUS_BAR_HEIGHT - 16;

// Animation constants
export const TRAY_CLOSED = 0;
export const TRAY_OPEN = 1;
export const TRAY_SLIDE_DURATION = 300;

export const BUTTONS_HIDDEN = 0;
export const BUTTONS_SHOWN = 1;
export const BUTTON_SLIDE_DURATION = 200;

export const UNFLIPPED = 0;
export const FLIPPED = 1;
export const FLIP_DURATION = 500;

export const KEYBOARD_HIDDEN = 0;
export const KEYBOARD_OPEN = 1;
export const KEYBOARD_DURATION = 200;

export const POSTCARD_SIZE_OPTIONS: PostcardSizeOption[] = [
  {
    key: PostcardSize.Small,
    image: SmallPostcard,
    title: i18n.t('Compose.smallPostcardTitle'),
    wordsLimit: 100,
    cost: 1,
    isPremium: false,
  },
  {
    key: PostcardSize.Medium,
    image: MediumPostcard,
    title: i18n.t('Compose.mediumPostcardTitle'),
    wordsLimit: 200,
    cost: 10,
    isPremium: true,
  },
  {
    key: PostcardSize.Large,
    image: LargePostcard,
    title: i18n.t('Compose.largePostcardTitle'),
    wordsLimit: 300,
    cost: 15,
    isPremium: true,
  },
];
