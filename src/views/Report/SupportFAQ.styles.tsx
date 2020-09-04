import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    flexDirection: 'column',
    padding: 16,
    alignItems: 'center',
  },
  needHelpButton: {
    backgroundColor: '#FC7272',
    borderRadius: 15,
    width: '100%',
    height: 50,
  },
  headerText: {
    color: Colors.AMEELIO_BLACK,
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  baseText: {
    color: Colors.AMEELIO_BLACK,
    fontSize: 16,
    paddingTop: 20,
    paddingBottom: 30,
    textAlign: 'center',
    width: '90%',
  },
});
