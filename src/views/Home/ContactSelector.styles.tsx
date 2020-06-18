import { StyleSheet } from 'react-native';
import { Colors, Typography } from '@styles';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: '#EDEDED',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 16,
  },
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 135,
    marginBottom: 16,
  },
  contactCardInfo: {
    color: Colors.GRAY_DARKER,
    fontSize: 16,
    paddingBottom: 6,
  },
  addContactButton: {
    marginBottom: 24,
    marginRight: 12,
    paddingLeft: 2,
    alignItems: 'center',
    backgroundColor: '#FC7272',
    borderRadius: 50,
    height: 65,
    width: 65,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
