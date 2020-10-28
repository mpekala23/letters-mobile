import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

const userSize = 24;
const referralSize = 42;
const contactSize = 80;
const singleContactSize = 130;
const avatarSize = 30;
const referrerSize = 90;

export default StyleSheet.create({
  contactBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    width: contactSize,
    height: contactSize,
    borderRadius: contactSize / 2,
    overflow: 'hidden',
    backgroundColor: Colors.AMEELIO_LIGHT_GRAY,
  },
  singleContactBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    width: singleContactSize,
    height: singleContactSize,
    borderRadius: singleContactSize / 2,
    overflow: 'hidden',
    backgroundColor: Colors.AMEELIO_LIGHT_GRAY,
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
    backgroundColor: Colors.AMEELIO_LIGHT_GRAY,
  },
  referralBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    width: referralSize,
    height: referralSize,
    borderRadius: userSize / 2,
    overflow: 'hidden',
    backgroundColor: Colors.AMEELIO_LIGHT_GRAY,
  },
  avatarBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    width: avatarSize,
    height: avatarSize,
    borderRadius: userSize / 2,
    overflow: 'hidden',
    backgroundColor: Colors.AMEELIO_LIGHT_GRAY,
    resizeMode: 'contain',
  },
  initials: {
    fontSize: 18,
    color: Colors.GRAY_400,
  },
  initialsBig: {
    fontSize: 36,
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
  referralPic: {
    width: referralSize,
    height: referralSize,
  },
  avatarPic: {
    width: avatarSize,
    height: avatarSize,
  },
  referralDashPic: {
    width: referrerSize,
    height: referrerSize,
  },
  referralDashBackground: {
    alignItems: 'center',
    justifyContent: 'center',
    width: referrerSize,
    height: referrerSize,
    borderRadius: referrerSize / 2,
    overflow: 'hidden',
    backgroundColor: Colors.AMEELIO_LIGHT_GRAY,
    borderWidth: 6,
    borderColor: 'white',
  },
});
