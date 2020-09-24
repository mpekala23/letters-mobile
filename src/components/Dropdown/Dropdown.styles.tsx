import { StyleSheet } from 'react-native';
import { STATUS_BAR_HEIGHT } from '@utils';
import { Colors } from '@styles';

export default StyleSheet.create({
  commonBackground: {
    flex: 1,
    zIndex: 999,
    elevation: 999,
    marginTop: STATUS_BAR_HEIGHT,
    marginHorizontal: 5,
    padding: STATUS_BAR_HEIGHT,
    justifyContent: 'center',
    borderRadius: 12,
  },
  successBackground: {
    backgroundColor: Colors.DROPDOWN_SUCCESS_BACKGROUND,
  },
  successText: {
    fontSize: 16,
    color: Colors.DROPDOWN_SUCCESS_TEXT,
  },
  warningBackground: {
    backgroundColor: Colors.DROPDOWN_WARNING_BACKGROUND,
  },
  warningText: {
    fontSize: 16,
    color: Colors.DROPDOWN_WARNING_TEXT,
  },
  errorBackground: {
    backgroundColor: Colors.DROPDOWN_ERROR_BACKGROUND,
  },
  errorText: {
    fontSize: 16,
    color: Colors.DROPDOWN_ERROR_TEXT,
  },
});
