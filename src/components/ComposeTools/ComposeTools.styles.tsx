import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  keyboardButtonContainer: {
    width: '100%',
    height: 50,
    borderTopWidth: 0.3,
    borderTopColor: Colors.GRAY_MEDIUM,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingBottom: 5,
  },
  keyboardButtonItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 120,
  },
});
