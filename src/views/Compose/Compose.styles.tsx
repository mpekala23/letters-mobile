import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from '@utils';

export default StyleSheet.create({
  screenBackground: {
    padding: 16,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 22,
    marginTop: 10,
    marginBottom: 4,
  },
  postcardBackground: {
    flexDirection: 'row',
    height: 'auto',
  },
  gridTrueBackground: {
    flex: 1,
    flexDirection: 'column',
  },
  gridPreviewBackground: {
    flex: 2,
    padding: 12,
  },
  gridOptionsBackground: {
    width: WINDOW_WIDTH,
    height: WINDOW_WIDTH,
    backgroundColor: '#323334',
  },
  subcategorySelectorBackground: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  subcategory: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 4,
  },
  subcategoryText: {
    color: 'white',
    fontSize: 18,
  },
  gridBackground: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  gridDesignBackground: {},
});
