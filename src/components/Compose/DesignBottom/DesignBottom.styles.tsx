import { BOTTOM_HEIGHT, WINDOW_WIDTH } from '@utils/Constants';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  bottom: {
    position: 'absolute',
    height: BOTTOM_HEIGHT,
    width: WINDOW_WIDTH,
    backgroundColor: '#323334',
  },
  gridBackground: {
    padding: 4,
  },
  subcategorySelectorBackground: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
  },
  subcategory: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 4,
    borderBottomWidth: 4,
  },
  subcategoryText: {
    color: 'white',
    fontSize: 18,
  },
});
