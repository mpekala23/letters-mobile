import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  profileCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: Colors.PINK_DARKER,
    borderRadius: 15,
    width: 68,
    height: 36,
  },
  logOutButton: {
    backgroundColor: Colors.BLUE_DARKEST,
    borderRadius: 16,
    width: '100%',
    height: 50,
  },
});
