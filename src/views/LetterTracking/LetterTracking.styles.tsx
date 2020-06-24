import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: 'white',
    flexDirection: 'column',
    padding: 16,
  },
  needHelpButton: {
    backgroundColor: '#FC7272',
    borderRadius: 15,
    width: '50%',
    height: 50,
    alignSelf: 'center',
    marginBottom: 25,
  },
  inTransitBar: {
    marginTop: 60,
    marginLeft: 14,
    height: 200,
    width: 7,
    backgroundColor: '#E1E1E1',
    position: 'absolute',
  },
  localAreaBar: {
    marginTop: 60,
    marginLeft: 14,
    height: 200,
    width: 7,
    backgroundColor: '#E1E1E1',
    position: 'absolute',
  },
  outForDeliveryBar: {
    marginTop: 60,
    marginLeft: 16,
    height: 200,
    width: 7,
    backgroundColor: '#E1E1E1',
    position: 'absolute',
  },
});
