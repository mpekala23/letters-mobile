import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  grayBar: {
    width: '100%',
    height: 2,
    backgroundColor: Colors.BLACK_200,
    marginVertical: 8,
  },
  verticalGrayBar: {
    height: '100%',
    width: 2,
    backgroundColor: Colors.BLACK_200,
    marginHorizontal: 8,
  },
});
