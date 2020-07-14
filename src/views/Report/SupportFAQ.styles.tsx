import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    padding: 16,
    alignItems: 'center',
  },
  regularButton: {
    borderColor: 'black',
    borderWidth: 1.5,
    borderRadius: 15,
    alignSelf: 'center',
    marginBottom: 14,
    paddingVertical: 4,
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
  buttonText: {
    fontSize: 14,
    color: 'black',
    fontWeight: '500',
    textAlign: 'center',
    flex: 1,
    flexWrap: 'wrap',
  },
});
