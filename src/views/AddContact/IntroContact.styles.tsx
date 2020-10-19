import { Colors } from '@styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  mainBackground: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 24,
  },
  titleText: {
    fontSize: 20,
    textAlign: 'center',
  },
  bodyText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    color: Colors.GRAY_400,
  },
  imageStyle: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginTop: 32,
  },
});
