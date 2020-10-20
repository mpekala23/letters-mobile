import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  trueBackground: {
    backgroundColor: 'white',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  baseText: {
    textAlign: 'center',
    color: Colors.GRAY_400,
    fontSize: 16,
    marginTop: 6,
  },
});
