import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: '#EDEDED',
    flexDirection: 'column',
  },
  profileCard: {
    backgroundColor: 'white',
    height: 360,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  profileCardHeader: {
    backgroundColor: '#FC7272',
    height: 100,
    width: '100%',
    borderRadius: 10,
    position: 'absolute',
    top: 16,
    left: 16,
  },
  sendLetterButton: {
    width: '100%',
    marginBottom: 12,
  },
  profileCardInfo: {
    color: Colors.GRAY_DARKER,
    fontSize: 16,
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
