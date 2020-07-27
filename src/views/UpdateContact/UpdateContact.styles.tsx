import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  profileCard: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  profileCardHeader: {
    backgroundColor: '#FC7272',
    height: 100,
    width: '100%',
    borderRadius: 10,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  sendLetterButton: {
    backgroundColor: '#FC7272',
    borderRadius: 15,
    width: '100%',
    height: 50,
  },
  deleteButton: {
    backgroundColor: Colors.BLUE_DARKEST,
  },
  roundPicUpload: {
    borderWidth: 10,
    borderColor: 'white',
    borderRadius: 65,
  },
  baseText: {
    fontSize: 14,
    paddingBottom: 4,
  },
});
