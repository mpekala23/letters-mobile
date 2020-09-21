import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from '@utils';

export const HEIGHT_LETTER = 225;
export const WIDTH_POSTCARD = WINDOW_WIDTH - 40;

export default StyleSheet.create({
  postcardImage: {
    marginVertical: 4,
    borderRadius: 10,
    alignSelf: 'center',
  },
  letterImage: {
    borderRadius: 8,
    margin: 4,
  },
});
