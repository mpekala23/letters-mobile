import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  background: {
    paddingVertical: 16,
  },
  currencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  numContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bigNum: {
    fontSize: 32,
  },
  smallText: {
    fontSize: 16,
    paddingBottom: 10,
    paddingLeft: 8,
  },
});
