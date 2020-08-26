import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  profileCard: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logOutButton: {
    backgroundColor: Colors.BLUE_500,
    borderRadius: 8,
    width: '100%',
    height: 48,
    marginTop: 16,
  },
  baseText: {
    fontSize: 14,
    paddingBottom: 4,
  },
  parentStyle: {
    width: '100%',
    marginBottom: 10,
  },
});
