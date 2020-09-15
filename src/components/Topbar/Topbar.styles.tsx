import { StyleSheet } from 'react-native';

export const BAR_HEIGHT = 80;

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
