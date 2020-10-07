import { StyleSheet } from 'react-native';
import { Typography, Colors } from '@styles';

export default StyleSheet.create({
  pickerContainer: {
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    backgroundColor: Colors.BLACK_200,
    borderColor: Colors.BLACK_200,
  },
  valueSelected: {
    backgroundColor: Colors.GREEN_100,
    borderColor: Colors.GREEN_300,
  },
  noValueSelected: {
    color: Colors.GRAY_MEDIUM,
    backgroundColor: Colors.PINK_100,
    borderColor: Colors.PINK_400,
  },
});

export const pickerStyles = StyleSheet.create({
  inputIOS: {
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    paddingVertical: 8,
    color: 'black',
  },
  inputAndroid: {
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    paddingTop: 10,
    paddingBottom: 6,
    color: 'black',
  },
  placeholder: {
    color: '#C7C7CD',
  },
  iconContainer: {
    top: 16,
    right: 16,
  },
});
