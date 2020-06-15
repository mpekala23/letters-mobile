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
    height: 115,
    marginBottom: 16,
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
