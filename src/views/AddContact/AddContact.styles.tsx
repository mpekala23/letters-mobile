import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from '@utils';

export default StyleSheet.create({
  bottomButtonContainer: {
    marginTop: 0,
    marginBottom: 15,
    flexDirection: 'row',
    width: WINDOW_WIDTH * 0.95,
    alignSelf: 'center',
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
