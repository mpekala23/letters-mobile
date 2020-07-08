import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

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
    height: 130,
    marginBottom: 16,
    paddingBottom: 4,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 1.8,
    elevation: 4,
  },
  contactCardInfo: {
    color: Colors.GRAY_DARKER,
    fontSize: 16,
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
