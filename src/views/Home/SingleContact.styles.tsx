import { StyleSheet } from 'react-native';
import { Colors, Typography } from '@styles';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: '#EDEDED',
    flexDirection: 'column',
  },
  profileCard: {
    backgroundColor: 'white',
    height: 380,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  sendLetterButton: {
    backgroundColor: '#FC7272',
    borderRadius: 15,
    width: '100%',
    height: 50,
  },
  profileCardInfo: {
    color: Colors.GRAY_DARKER,
    fontSize: 16,
    paddingBottom: 8,
  },
  actionItems: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    height: 100,
    paddingTop: 10,
    paddingLeft: 20,
  },
});
