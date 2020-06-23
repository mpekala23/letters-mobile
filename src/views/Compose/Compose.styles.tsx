import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  screenBackground: {
    padding: 10,
    flex: 1,
    flexDirection: 'column',
  },
  headerText: {
    fontSize: 22,
    marginVertical: 10,
  },
  keyboardButtonContainer: {
    width: '100%',
    height: 50,
    borderTopWidth: 0.5,
    borderTopColor: Colors.AMEELIO_GRAY,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  keyboardButtonItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
});
