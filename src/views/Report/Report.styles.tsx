import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingTop: 40,
    alignItems: 'center',
  },
  question: { fontSize: 23, textAlign: 'center', width: '80%' },
  description: {
    color: Colors.GRAY_DARKER,
    fontSize: 16,
    textAlign: 'center',
    width: '80%',
  },
  button: {
    width: '100%',
    height: 44,
    backgroundColor: '#FF7171',
    borderRadius: 8,
  },
  buttonReverse: {
    width: '100%',
    height: 44,
    borderColor: '#FF7171',
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  buttonText: { fontSize: 14, color: '#FF7171' },
  textAreaBox: {
    width: '100%',
    height: '50%',
    backgroundColor: '#F6F6F6',
    borderRadius: 4,
    marginTop: 10,
    padding: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  textAreaText: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-start',
  },
});
