import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export const VERTICAL_MARGIN = 5;

export default StyleSheet.create({
  parentStyle: {
    width: '100%',
    marginBottom: VERTICAL_MARGIN * 2,
    backgroundColor: Colors.GRAY_200,
    borderRadius: 8,
    overflow: 'hidden',
  },
  scrollStyle: {
    flex: 1,
    width: '100%',
  },
  baseInputStyle: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.GRAY_200,
    paddingHorizontal: 10,
    fontSize: 16,
    color: 'black',
    paddingVertical: 8,
  },
  baseInputAndroidPadding: {
    paddingTop: 10,
    paddingBottom: 6,
  },
  inputStyleFocused: {
    color: Colors.AMEELIO_BLACK,
  },
  validStyle: {
    backgroundColor: Colors.GREEN_100,
    borderColor: Colors.GREEN_300,
    color: 'black',
  },
  invalidStyle: {
    color: Colors.GRAY_300,
    borderColor: Colors.PINK_400,
    backgroundColor: Colors.PINK_100,
  },
  disabledInputStyle: {
    opacity: 0.7,
    color: Colors.GRAY_300,
  },
  secureButtonsContainer: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    width: 80,
    paddingHorizontal: 10,
  },
});
