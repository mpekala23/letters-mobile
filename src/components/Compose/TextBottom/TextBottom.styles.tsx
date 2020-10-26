import { BOTTOM_HEIGHT, WINDOW_WIDTH } from '@utils/Constants';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  bottom: {
    position: 'absolute',
    height: BOTTOM_HEIGHT,
    width: WINDOW_WIDTH,
    backgroundColor: '#323334',
  },
});
