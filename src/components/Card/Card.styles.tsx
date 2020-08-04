import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
  },
  cardBase: {
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
    borderRadius: 6,
    marginVertical: 6,
  },
  cardTitle: {
    fontSize: 24,
    color: Colors.AMEELIO_BLACK,
  },
  cardData: {
    fontSize: 18,
    color: Colors.AMEELIO_GRAY,
  },
  letterStatusTitle: {
    fontSize: 20,
    color: Colors.AMEELIO_BLACK,
  },
  letterStatusData: {
    fontSize: 16,
    color: Colors.AMEELIO_GRAY,
  },
  letterStatusBackground: {
    flexDirection: 'row',
  },
  letterStatusBar: {
    width: 6,
    height: '100%',
    borderRadius: 8,
    marginRight: 15,
  },
  statusAndDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 16,
    color: Colors.AMEELIO_GRAY,
  },
  memoryLaneBackground: {
    padding: 0,
    height: 210,
  },
  memoryLaneTextBackground: {
    padding: 8,
  },
  memoryLanePicture: {
    height: '50%',
    width: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  memoryLaneText: {
    fontSize: 18,
    fontWeight: '500',
    height: 65,
  },
  letterOptionsBackground: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 110,
  },
  deliveryAndDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryStatusBarBackground: {
    height: 10,
    marginTop: 15,
    width: '100%',
    backgroundColor: '#F2F2F2',
    borderRadius: 5,
    overflow: 'hidden',
  },
  deliveryStatusBarForeground: {
    position: 'absolute',
    height: 10,
    backgroundColor: '#6D89B1',
  },
  creditsTitle: {
    fontSize: 20,
    color: Colors.AMEELIO_BLACK,
  },
  creditsResetMessage: {
    fontSize: 14,
    color: Colors.AMEELIO_GRAY,
  },
  creditsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditsSendMoreText: {
    flex: 1,
    fontSize: 18,
    color: Colors.PINK_DARKER,
  },
});
