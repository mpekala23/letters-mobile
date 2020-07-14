import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from '@utils';
import { Colors } from '@styles';

export default StyleSheet.create({
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
    borderColor: Colors.PINK_DARKER,
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
    marginLeft: 16,
    width: '91%',
  },
  searchInput: {
    padding: 20,
    borderRadius: 20,
  },
  addManuallyButton: {
    width: 200,
  },
  hintBackground: {
    backgroundColor: Colors.BLUE_LIGHTER,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.BLUE_LIGHT,
    borderRadius: 4,
    padding: 6,
    marginHorizontal: 16,
    marginBottom: 8,
  },
});
