import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  cardsBackground: {
    flex: 1,
    backgroundColor: '#EDEDED',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 16,
  },
  textBackground: {
    flex: 1,
    backgroundColor: '#EDEDED',
    flexDirection: 'column',
    padding: 16,
  },
  baseText: {
    textAlign: 'center',
    fontSize: 20,
    color: Colors.GRAY_700,
  },
});
