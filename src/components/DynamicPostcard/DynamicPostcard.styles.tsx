import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  background: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgb(221,221,221)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  writingBackground: {
    flexDirection: 'row',
    backgroundColor: 'rgb(242, 242, 242)',
  },
  writingDivider: {
    width: 1,
    height: '92%',
    alignSelf: 'center',
    backgroundColor: 'rgb(228, 228, 228)',
  },
});
