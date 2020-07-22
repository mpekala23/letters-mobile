import { StyleSheet } from 'react-native';
import { Colors } from 'styles';

export default StyleSheet.create({
  trueBackground: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    padding: 16,
    justifyContent: 'space-between',
  },
  fullWidth: {
    width: '100%',
  },
  baseText: {
    textAlign: 'center',
    color: Colors.GRAY_DARK,
    fontSize: 16,
    marginTop: 6,
  },
});
