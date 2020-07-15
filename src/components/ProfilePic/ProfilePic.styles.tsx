import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

const userSize = 46;
const contactSize = 80;
const singleContactSize = 130;

export default StyleSheet.create({
  contactBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    width: contactSize,
    height: contactSize,
    borderRadius: contactSize / 2,
    overflow: 'hidden',
    backgroundColor: '#F4F4F4',
  },
  singleContactBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    width: singleContactSize,
    height: singleContactSize,
    borderRadius: singleContactSize / 2,
    overflow: 'hidden',
    backgroundColor: '#F4F4F4',
    borderWidth: 6,
    borderColor: 'white',
  },
  userBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    width: userSize,
    height: userSize,
    borderRadius: userSize / 2,
    overflow: 'hidden',
    backgroundColor: '#F4F4F4',
  },
  initials: {
    fontSize: 20,
    fontWeight: '500',
    color: Colors.GRAY_DARK,
  },
  initialsBig: {
    fontSize: 36,
    fontWeight: '500',
    color: 'white',
  },
  contactPic: {
    width: contactSize,
    height: contactSize,
  },
  singleContactPic: {
    width: singleContactSize,
    height: singleContactSize,
  },
  userPic: {
    width: userSize,
    height: userSize,
  },
});
