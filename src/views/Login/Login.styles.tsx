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
  loginButton: {
    backgroundColor: Colors.PINK_DARK,
    borderRadius: 15,
    width: '100%',
    height: 50,
  },
  forgotContainer: {
    backgroundColor: 'white',
    marginBottom: 30,
  },
  forgotText: {
    color: Colors.PINK_DARK,
    fontSize: 16,
    fontWeight: '500',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
