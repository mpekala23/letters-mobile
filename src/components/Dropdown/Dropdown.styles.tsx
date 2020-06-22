import { StyleSheet } from 'react-native';
import { STATUS_BAR_HEIGHT } from '@utils';

export default StyleSheet.create({
  commonBackground: {
    flex: 1,
    zIndex: 999,
    marginTop: STATUS_BAR_HEIGHT,
    marginHorizontal: 5,
    padding: STATUS_BAR_HEIGHT,
    justifyContent: 'center',
    borderRadius: 12,
  },
  successBackground: {
    backgroundColor: '#F0FAF3',
  },
  successText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#09863D',
  },
  errorBackground: {
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#762B2B',
  },
});
