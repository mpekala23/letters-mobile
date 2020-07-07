import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    position: 'absolute',
    top: 24,
    left: '30%',
  },
  ameelioLogo: {
    fontSize: 26,
    paddingTop: 18,
    paddingLeft: 4,
    color: Colors.PINK_DARK,
  },
  titleText: {
    fontSize: 24,
    textAlign: 'center',
  },
  baseText: {
    fontSize: 18,
  },
  registerButton: {
    backgroundColor: Colors.PINK_DARK,
    borderRadius: 15,
    width: '100%',
    height: 50,
  },
  loginButton: {
    backgroundColor: 'white',
    borderColor: Colors.PINK_DARK,
    borderWidth: 2,
    borderRadius: 15,
    height: 50,
  },
});
