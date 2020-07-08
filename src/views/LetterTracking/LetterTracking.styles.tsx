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
    backgroundColor: '#FC7272',
    borderRadius: 15,
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
});
