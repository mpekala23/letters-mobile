import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  grayBar: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.GRAY_LIGHT,
    marginVertical: 8,
  },
  verticalGrayBar: {
    height: '100%',
    width: 2,
    backgroundColor: Colors.GRAY_LIGHT,
    marginHorizontal: 8,
  },
});
