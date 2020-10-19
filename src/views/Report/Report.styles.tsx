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
  title: { fontSize: 20, textAlign: 'center', width: '80%' },
  description: {
    color: Colors.GRAY_400,
    fontSize: 16,
    textAlign: 'center',
    width: '80%',
  },
  button: {
    width: '100%',
    height: 44,
    backgroundColor: Colors.PINK_500,
    borderRadius: 8,
  },
  buttonReverse: {
    width: '100%',
    height: 44,
    borderColor: Colors.PINK_500,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  buttonReverseBlack: {
    width: '100%',
    height: 44,
    borderColor: Colors.AMEELIO_BLACK,
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  buttonText: { fontSize: 15, color: Colors.PINK_500 },
  buttonTextReverse: { fontSize: 15, color: Colors.AMEELIO_WHITE },
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
