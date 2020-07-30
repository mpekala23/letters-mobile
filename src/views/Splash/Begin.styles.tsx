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
    alignSelf: 'flex-start',
  },
  ameelioLogo: {
    fontSize: 26,
    paddingTop: 4,
    paddingLeft: 4,
    color: Colors.AMEELIO_BLUE,
  },
  titleText: {
    width: '100%',
    fontSize: 20,
    alignSelf: 'flex-start',
  },
  baseText: {
    fontSize: 18,
  },
});
