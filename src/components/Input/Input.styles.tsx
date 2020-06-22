import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export const INPUT_HEIGHT = 50;
export const DROP_HEIGHT = 250;
export const OPTION_HEIGHT = 50;
export const NUM_OPTIONS = 4;
export const VERTICAL_MARGIN = 5;

export default StyleSheet.create({
  parentStyle: {
    width: '100%',
    marginBottom: VERTICAL_MARGIN * 2,
  },
  scrollStyle: {
    flex: 1,
    width: '100%',
  },
  inputStyle: {
    width: '100%',
    height: INPUT_HEIGHT,
    borderWidth: 2,
    borderRadius: 4,
    padding: 10,
    fontSize: 18,
    color: Colors.AMEELIO_BLACK,
    borderColor: Colors.AMEELIO_BLACK,
  },
  inputStyleFocused: {
    height: INPUT_HEIGHT,
    borderWidth: 2,
    borderRadius: 4,
    padding: 10,
    fontSize: 18,
    color: Colors.AMEELIO_BLACK,
    borderColor: Colors.AMEELIO_BLUE,
    backgroundColor: 'white',
  },
  invalidStyle: {
    height: INPUT_HEIGHT,
    borderWidth: 2,
    borderRadius: 4,
    padding: 10,
    fontSize: 18,
    color: Colors.AMEELIO_BLACK,
    borderColor: Colors.AMEELIO_RED,
    backgroundColor: Colors.ALERT_LIGHT,
  },
  optionBackground: {
    width: '100%',
    zIndex: 5,
  },
  optionScroll: {
    width: '100%',
    flex: 1,
  },
  optionContainer: {
    width: '100%',
    height: OPTION_HEIGHT,
    justifyContent: 'center',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.AMEELIO_BLACK,
  },
  optionText: {},
});
