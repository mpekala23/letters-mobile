import {
  BAR_HEIGHT,
  POSTCARD_HEIGHT,
  STATUS_BAR_HEIGHT,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from '@utils/Constants';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  textButtons: {
    position: 'absolute',
    height:
      WINDOW_HEIGHT - BAR_HEIGHT - STATUS_BAR_HEIGHT - POSTCARD_HEIGHT - 32,
    width: WINDOW_WIDTH,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'flex-end',
  },
});
