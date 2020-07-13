import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  backgroundScroll: {
    flex: 1,
    marginHorizontal: 10,
  },
  scrollContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 100,
  },
  fullWidth: {
    width: '100%',
  },
  picContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  privacyBackground: {
    width: '100%',
    backgroundColor: Colors.AMEELIO_LIGHT_BLUE,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BEDAFC',
    borderRadius: 4,
    padding: 10,
    marginBottom: 15,
  },
  privacyText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '400',
    color: '#124181',
  },
  registerButton: {
    borderRadius: 15,
    width: '100%',
    height: 50,
  },
});
