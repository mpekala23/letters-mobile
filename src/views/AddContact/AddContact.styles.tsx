import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  bottomButtonContainer: {
    padding: 15,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: Colors.PINK_100,
  },
  bottomButton: {
    flex: 1,
    margin: 10,
  },
  contactbackground: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  fullWidth: {
    width: '100%',
  },
});
