import { StyleSheet } from 'react-native';
import { Colors } from '@styles';
import { withSafeAreaInsets } from 'react-native-safe-area-context';

const size = 45;

export default StyleSheet.create({
  background: {
    alignItems: 'center',
    justifyContent: 'center',
    width: size,
    height: size,
    borderRadius: size / 2,
    overflow: 'hidden',
    backgroundColor: Colors.AMEELIO_ORANGE,
  },
  initials: {
    fontSize: 22,
    fontWeight: '500',
    color: 'white',
  },
  pic: {
    width: size,
    height: size,
  },
});
