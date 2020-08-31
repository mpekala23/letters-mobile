import { StyleSheet } from 'react-native';

export const barHeight = 80;

export default StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: barHeight,
    paddingHorizontal: 10,
    backgroundColor: 'white',
    elevation: 5,
    zIndex: 10,
  },
  backContainer: {
    position: 'absolute',
    left: 19,
    width: 30,
    height: barHeight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
});
