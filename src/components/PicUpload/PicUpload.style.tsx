import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  profileBackground: {
    borderRadius: 68,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaBackground: {
    overflow: 'hidden',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDelete: {
    top: 12,
    right: 12,
  },
  mediaDelete: {
    top: 3,
    right: 3,
  },
  oneCreditWarningText: {
    position: 'absolute',
    width: 200,
    height: 40,
    textAlign: 'center',
    zIndex: 9,
    top: 32,
    left: 0,
    fontSize: 21,
    color: Colors.GRAY_300,
  },
});
