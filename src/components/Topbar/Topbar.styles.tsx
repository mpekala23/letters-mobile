import { StyleSheet } from 'react-native';

export const barHeight = 70;

export default StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: barHeight,
    paddingHorizontal: 10,
    paddingBottom: 5,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.21,
    shadowRadius: 2,
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
  },
});
