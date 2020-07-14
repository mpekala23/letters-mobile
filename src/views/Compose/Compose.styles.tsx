import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  screenBackground: {
    padding: 16,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 22,
    marginTop: 10,
    marginBottom: 4,
  },
  keyboardButtonContainer: {
    width: '100%',
    height: 50,
    borderTopWidth: 0.3,
    borderTopColor: Colors.GRAY_MEDIUM,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
  },
  keyboardButtonItem: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    maxWidth: 120,
  },
  postcardBackground: {
    flexDirection: 'row',
    height: 'auto',
  },
});
