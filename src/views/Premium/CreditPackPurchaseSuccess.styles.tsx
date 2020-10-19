import { Colors } from '@styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: Colors.AMEELIO_WHITE,
    padding: 16,
    justifyContent: 'center',
  },
  contentBackground: {
    alignItems: 'center',
  },
  title: {
    marginTop: 24,
    fontSize: 18,
  },
  body: {
    fontSize: 16,
    color: Colors.GRAY_600,
    textAlign: 'center',
    marginVertical: 16,
  },
});
