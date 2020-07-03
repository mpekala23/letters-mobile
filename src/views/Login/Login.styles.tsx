import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  loginBackground: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avoidingBackground: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  welcomeBackText: {
    fontSize: 14,
    paddingTop: 6,
    paddingBottom: 28,
    color: Colors.GRAY_DARK,
  },
  loginButton: {
    backgroundColor: Colors.PINK_DARKER,
    borderRadius: 15,
    width: '100%',
    height: 50,
  },
  forgotContainer: {
    backgroundColor: 'white',
    marginBottom: 30,
  },
  forgotText: {
    color: Colors.PINK_DARKER,
    fontSize: 16,
    fontWeight: '500',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
