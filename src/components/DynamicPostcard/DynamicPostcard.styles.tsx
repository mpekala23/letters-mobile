import { StyleSheet } from 'react-native';

const LAYOUT_PADDING = 4;

export default StyleSheet.create({
  background: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'rgb(221,221,221)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  writingBackground: {
    flexDirection: 'row',
    backgroundColor: 'rgb(242, 242, 242)',
  },
  writingDivider: {
    width: 1,
    height: '92%',
    alignSelf: 'center',
    backgroundColor: 'rgb(228, 228, 228)',
  },
  imageBackground: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
  },
  imagesBackground: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
  },
  sideBackground: {
    position: 'absolute',
    width: '100%',
  },
  leftFull: {
    flex: 1,
    padding: LAYOUT_PADDING,
    paddingRight: 0,
  },
  rightFull: {
    flex: 1,
    padding: LAYOUT_PADDING,
    paddingLeft: 0,
  },
  rightTop: {
    flex: 1,
    paddingBottom: 0,
  },
  rightBottom: {
    flex: 1,
    paddingTop: 0,
  },
  leftTop: {
    flex: 1,
    paddingBottom: 0,
  },
  leftBottom: {
    flex: 1,
    paddingTop: 0,
  },
  rightContainer: {
    flex: 1,
    padding: LAYOUT_PADDING,
    paddingLeft: 0,
    flexDirection: 'column',
  },
  leftContainer: {
    flex: 1,
    padding: LAYOUT_PADDING,
    paddingRight: 0,
    flexDirection: 'column',
  },
});
