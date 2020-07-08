import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from '@utils';
import { Colors } from '@styles';

export default StyleSheet.create({
  facilityBackground: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 20,
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
    marginBottom: 10,
  },
  selectedBackground: {
    backgroundColor: Colors.PINK_LIGHTER,
  },
  itemTitle: {
    fontSize: 16,
  },
  itemInfo: {
    color: Colors.AMEELIO_GRAY,
  },
  footerBackground: {
    marginTop: 20,
  },
  searchParent: {
    marginTop: 10,
    marginLeft: 10,
    width: '95%',
  },
  searchInput: {
    padding: 10,
    borderRadius: 20,
  },
  addManuallyButton: {
    backgroundColor: Colors.PINK_DARKER,
    borderRadius: 15,
    width: '100%',
    height: 50,
  },
});
