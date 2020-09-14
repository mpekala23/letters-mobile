import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '@utils';

export const BOTTOM_HEIGHT = WINDOW_HEIGHT * 0.5;
export const DESIGN_BUTTONS_HEIGHT = 208;

export default StyleSheet.create({
  screenBackground: {
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
    backgroundColor: 'white',
  },
  gridPreviewBackground: {
    width: WINDOW_WIDTH,
    height: ((WINDOW_HEIGHT - 80) * 2) / 5,
    padding: 12,
  },
  gridOptionsBackground: {
    width: '100%',
    height: ((WINDOW_HEIGHT - 80) * 3) / 5,
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
    paddingBottom: 26,
  },
  gridDesignBackground: {},
  designButtons: {
    position: 'absolute',
    height: DESIGN_BUTTONS_HEIGHT,
    width: WINDOW_WIDTH,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'flex-end',
  },
  bottom: {
    position: 'absolute',
    height: BOTTOM_HEIGHT,
    width: WINDOW_WIDTH,
    backgroundColor: '#323334',
  },
});
