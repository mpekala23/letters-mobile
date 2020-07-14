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
    top: 10,
    left: '30%',
  },
  ameelioLogo: {
    fontSize: 26,
    paddingTop: 4,
    paddingLeft: 4,
    color: Colors.AMEELIO_BLUE,
  },
  titleText: {
    width: '80%',
    fontSize: 20,
    textAlign: 'center',
  },
  baseText: {
    fontSize: 18,
  },
});
