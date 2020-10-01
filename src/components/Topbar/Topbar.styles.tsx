import { StyleSheet } from 'react-native';
import { BAR_HEIGHT } from '@utils/Constants';

export default StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: BAR_HEIGHT,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    elevation: 5,
    zIndex: 10,
  },
  backContainer: {
    position: 'absolute',
    left: 19,
    width: 30,
    height: BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
});
