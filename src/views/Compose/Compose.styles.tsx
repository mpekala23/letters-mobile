import { StyleSheet } from 'react-native';
import { WINDOW_WIDTH } from '@utils';
import { BOTTOM_HEIGHT, POSTCARD_HEIGHT } from '@utils/Constants';

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
  gridBackground: {
    padding: 4,
  },
  gridDesignBackground: {},
});
