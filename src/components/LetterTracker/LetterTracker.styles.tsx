import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

const circleSize = 44;

export default StyleSheet.create({
  receivedOrderCircle: {
    borderRadius: 50,
    backgroundColor: 'pink',
    height: circleSize,
    width: circleSize,
    marginRight: 24,
  },
});
