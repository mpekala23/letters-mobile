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
  subtitle: {
    fontSize: 14,
    paddingTop: 6,
    paddingBottom: 28,
    color: Colors.GRAY_500,
  },
  button: {
    backgroundColor: Colors.PINK_500,
    borderRadius: 15,
    width: '100%',
    height: 50,
  },
  forgotContainer: {
    backgroundColor: 'white',
    marginLeft: 4,
    marginTop: 16,
    marginBottom: 10,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
