import { StyleSheet } from 'react-native';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '@utils';

export default StyleSheet.create({
  trueBackground: {
    position: 'absolute',
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
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
