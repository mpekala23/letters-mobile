import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  backgroundScroll: {
    flex: 1,
    marginHorizontal: 16,
  },
  scrollContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 36,
  },
  fullWidth: {
    width: '100%',
  },
  picContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  registerButton: {
    borderRadius: 15,
    width: '100%',
    height: 50,
  },
});
