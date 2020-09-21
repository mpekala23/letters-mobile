import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    flexDirection: 'column',
    padding: 16,
  },
  cardBackground: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: Colors.AMEELIO_WHITE,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 1.8,
    elevation: 4,
    borderRadius: 8,
  },
  uspsCircleBackground: {
    borderRadius: 40,
    width: 43,
    height: 43,
    backgroundColor: Colors.AMEELIO_BLACK,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  needHelpButton: {
    alignSelf: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  headerText: {
    color: Colors.AMEELIO_BLACK,
    fontSize: 21,
    paddingBottom: 4,
  },
  baseText: {
    color: Colors.AMEELIO_BLACK,
    fontSize: 14,
  },
  animatedTruck: {
    borderRadius: 50,
    backgroundColor: Colors.BLUE_500,
    height: 48,
    width: 48,
    position: 'absolute',
    left: 0,
    zIndex: 999,
  },
  endpointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  endpointCityLabel: {
    fontSize: 16,
  },
  endpointDate: {
    color: Colors.GRAY_500,
  },
  estimatedDeliveryLabel: {
    color: Colors.GRAY_500,
  },
});
