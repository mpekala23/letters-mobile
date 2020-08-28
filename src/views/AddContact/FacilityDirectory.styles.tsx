import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from '@utils';
import { Colors } from '@styles';

export default StyleSheet.create({
  topSection: {
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  facilityBackground: {
    flex: 1,
    backgroundColor: 'white',
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  flatBackground: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
    paddingTop: 10,
  },
  itemBackground: {
    backgroundColor: 'white',
    width: WINDOW_WIDTH * 0.9,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: 'white',
    marginBottom: 10,
  },
  selectedBackground: {
    borderWidth: 2,
    borderColor: Colors.PINK_500,
  },
  itemTitle: {
    fontSize: 16,
  },
  itemInfo: {
    color: Colors.AMEELIO_GRAY,
  },
  footerBackground: {
    marginTop: 20,
    alignItems: 'center',
  },
  searchParent: {
    marginTop: 4,
    width: '100%',
  },
  searchInput: {
    borderRadius: 20,
  },
  addManuallyButton: {
    width: 200,
  },
  hintBackground: {
    backgroundColor: Colors.BLUE_200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.BLUE_300,
    borderRadius: 4,
    padding: 6,
    marginHorizontal: 16,
    marginBottom: 8,
  },
});
