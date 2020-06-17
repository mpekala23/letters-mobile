import { StyleSheet } from 'react-native';
import { Colors } from '@styles';
import { AMEELIO_BLUE } from 'styles/Colors';

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
  forgotContainer: {
    backgroundColor: 'white',
    marginBottom: 30,
    width: '60%',
  },
  forgotText: {
    color: Colors.AMEELIO_BLUE,
    fontSize: 16,
    fontWeight: '500',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
