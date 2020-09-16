import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    padding: 16,
  },
  letterDate: {
    borderColor: Colors.BLACK_200,
    borderBottomWidth: 2,
    paddingBottom: 16,
  },
  baseText: {
    fontSize: 24,
  },
  letterText: {
    fontSize: 18,
    color: Colors.AMEELIO_BLACK,
    padding: 8,
    paddingTop: 16,
    paddingBottom: 36,
  },
});
