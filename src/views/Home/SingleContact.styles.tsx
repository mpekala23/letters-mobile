import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    flexDirection: 'column',
  },
  profileCard: {
    backgroundColor: 'white',
    height: 340,
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
    marginBottom: 16,
  },
  profileCardInfo: {
    color: Colors.GRAY_DARKER,
    fontSize: 14,
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
