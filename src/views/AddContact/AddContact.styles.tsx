import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  bottomButtonContainer: {
    padding: 15,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: Colors.PINK_LIGHTEST,
  },
  bottomButton: {
    flex: 1,
    margin: 10,
  },
  contactbackground: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  fullWidth: {
    width: '100%',
  },
});
