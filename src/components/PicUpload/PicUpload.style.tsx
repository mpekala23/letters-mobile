import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  profileBackground: {
    borderRadius: 50,
    backgroundColor: Colors.AMEELIO_BLUE,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaBackground: {
    overflow: 'hidden',
    borderRadius: 20,
    borderWidth: 5,
    borderColor: Colors.AMEELIO_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
