import { Colors } from '@styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 16,
  },
  helpedContainer: {
    paddingHorizontal: 16,
  },
  familiesHelpedText: {
    color: Colors.GRAY_400,
    fontSize: 18,
  },
  familiesHelpedNumber: {
    color: Colors.GRAY_700,
    fontSize: 40,
  },
});
