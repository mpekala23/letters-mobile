import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: 'white',
  },
  shadowBox: {
    width: 120,
    height: 144,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderRadius: 4,
  },
  viewHistoryButton: {
    position: 'absolute',
    right: 16,
    top: 136,
  },
});
