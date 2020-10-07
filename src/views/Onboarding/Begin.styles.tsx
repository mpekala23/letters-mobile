import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: 'white',
  },
  page: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  padded: {
    padding: 32,
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
});
