import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  buttonBackground: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.PINK_DARKER,
    marginVertical: 5,
    paddingHorizontal: 14,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.22,
    elevation: 2,
  },
  buttonBackgroundReverse: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: Colors.PINK_DARKER,
    marginVertical: 5,
  },
  buttonBackgroundDisabled: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: Colors.PINK_DARK,
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    padding: 6,
  },
  buttonTextReverse: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.PINK_DARKER,
    padding: 6,
  },
  buttonTextDisabled: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    padding: 6,
  },
  linkText: {
    fontSize: 16,
    color: Colors.PINK_DARKER,
  },
});
