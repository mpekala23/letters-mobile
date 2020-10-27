import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  buttonBackground: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.PINK_500,
    marginVertical: 5,
    paddingHorizontal: 14,
    paddingVertical: 2,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  buttonBackgroundReverse: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'white',
    marginVertical: 5,
    borderWidth: 2,
    borderColor: Colors.GRAY_200,
  },
  buttonBackgroundDisabled: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.PINK_400,
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    paddingVertical: 8,
    paddingHorizontal: 3,
  },
  buttonTextReverse: {
    fontSize: 18,
    color: Colors.PINK_500,
    padding: 6,
  },
  buttonTextDisabled: {
    fontSize: 18,
    color: 'white',
    padding: 6,
  },
  buttonPaddingAndroid: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  linkText: {
    fontSize: 16,
    color: Colors.PINK_500,
  },
});
