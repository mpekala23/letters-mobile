import { StyleSheet } from 'react-native';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@utils';

export const GRAY_BACK = 'rgba(0,0,0,0.25)';

export default StyleSheet.create({
  trueBackground: {
    position: 'absolute',
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    backgroundColor: GRAY_BACK,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
    elevation: 999,
  },
  alertBackground: {
    backgroundColor: 'white',
    width: '85%',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
