import { StyleSheet } from 'react-native';
import { Colors } from '@styles';
import { WINDOW_HEIGHT } from '@utils/Constants';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: 'white',
  },
  page: {
    width: '100%',
    height: '100%',
  },
  padded: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  baseText: {
    fontSize: 18,
  },
  buttonContainer: {
    width: '100%',
    padding: 24,
    justifyContent: 'flex-end',
  },
  swipePositionBackground: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
  },
  swipeCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  screenTitle: {
    fontSize: 21,
    padding: 32,
    alignItems: 'center',
    textAlign: 'center',
  },
  screenImage: {
    width: '100%',
    height: WINDOW_HEIGHT * 0.5,
    resizeMode: 'contain',
  },
});
