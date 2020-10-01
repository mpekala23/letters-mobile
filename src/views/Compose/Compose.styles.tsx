import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '@utils';
import {
  BAR_HEIGHT,
  POSTCARD_HEIGHT,
  STATUS_BAR_HEIGHT,
} from '@utils/Constants';

export const BOTTOM_HEIGHT =
  WINDOW_HEIGHT - POSTCARD_HEIGHT - BAR_HEIGHT - STATUS_BAR_HEIGHT - 16;
export const DESIGN_BUTTONS_HEIGHT = 208;
export const LETTER_COMPOSE_IMAGE_HEIGHT = 150;

export default StyleSheet.create({
  screenBackground: {
    flex: 1,
    paddingHorizontal: 16,
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
    height: POSTCARD_HEIGHT + 32,
    padding: 16,
  },
  gridOptionsBackground: {
    width: '100%',
    height: BOTTOM_HEIGHT,
    backgroundColor: '#323334',
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
  gridBackground: {
    padding: 4,
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
