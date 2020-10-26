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
  sideContainer: {
    position: 'absolute',
    width: 160,
    height: BAR_HEIGHT,
    justifyContent: 'center',
  },
  leftContainer: {
    left: 19,
    alignItems: 'flex-start',
  },
  rightContainer: {
    right: 19,
    alignItems: 'flex-end',
  },
});
