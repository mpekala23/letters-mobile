import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    padding: 16,
  },
  needHelpButton: {
    width: '50%',
    height: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
  headerText: {
    color: Colors.AMEELIO_BLACK,
    fontSize: 21,
    paddingBottom: 4,
  },
  baseText: {
    color: Colors.AMEELIO_BLACK,
    fontSize: 14,
  },
  trackingPhoto: {
    height: 275,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    aspectRatio: 1,
  },
});
