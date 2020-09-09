import { StyleSheet } from 'react-native';
import { Typography } from '@styles';

export default StyleSheet.create({
  pickerContainer: {
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 2,
    backgroundColor: '#F2F2F2',
    borderColor: '#F2F2F2',
  },
  valueSelected: {
    backgroundColor: '#F0FAF3',
    borderColor: '#9EE2B8',
  },
  noValueSelected: {
    color: '#9A9A9A',
    borderColor: '#FF9E9E',
    backgroundColor: '#FFF5F5',
  },
});

export const pickerStyles = StyleSheet.create({
  inputIOS: {
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    marginVertical: 3,
    paddingVertical: 6,
  },
  inputAndroid: {
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: Typography.FONT_FAMILY_REGULAR,
    marginVertical: 3,
    paddingTop: 8,
    paddingBottom: 4,
  },
  placeholder: {
    color: '#cdcdcd',
  },
  iconContainer: {
    top: 16,
    right: 16,
  },
});
