import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  keyboardButtonContainer: {
    width: '100%',
    height: 40,
    borderTopWidth: 0.34,
    borderTopColor: Colors.GRAY_300,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  keyboardButtonItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 120,
    height: '100%',
  },
});
