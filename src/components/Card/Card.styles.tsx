import { StyleSheet } from 'react-native';
import { Colors } from '@styles';
import { WINDOW_WIDTH } from '@utils';

export default StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  cardBase: {
    backgroundColor: 'white',
    width: '100%',
    padding: 15,
    borderRadius: 6,
    marginVertical: 6,
  },
  cardTitle: {
    fontSize: 24,
    color: Colors.AMEELIO_BLACK,
  },
  cardData: {
    fontSize: 18,
    color: Colors.AMEELIO_GRAY,
  },
  horizontalCardLayout: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  letterStatusTitle: {
    fontSize: 20,
    color: Colors.AMEELIO_BLACK,
  },
  letterStatusData: {
    fontSize: 16,
    color: Colors.AMEELIO_GRAY,
  },
  letterStatusBackground: {
    flexDirection: 'row',
  },
  letterStatusBar: {
    width: 6,
    height: '100%',
    borderRadius: 8,
    marginRight: 8,
  },
  statusAndDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  date: {
    fontSize: 14,
    color: Colors.AMEELIO_GRAY,
    marginBottom: 8,
  },
  memoryLaneBackground: {
    padding: 0,
    height: 210,
    borderRadius: 6,
  },
  memoryLaneTextBackground: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memoryLanePicture: {
    height: '50%',
    width: '100%',
    resizeMode: 'cover',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  memoryLaneText: {
    fontSize: 18,
    overflow: 'hidden',
    marginTop: 8,
  },
  memoryLanePostcardBackground: {
    backgroundColor: 'rgba(0,0,0, 0.30)',
    flex: 1,
    borderRadius: 6,
  },
  memoryLanePostcardPicture: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 6,
  },
  memoryLanePostcardDate: {
    color: 'white',
    fontSize: 16,
    marginTop: 'auto',
    marginBottom: 8,
  },
  letterOptionsBackground: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: 110,
  },
  deliveryAndDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deliveryStatusBarBackground: {
    height: 10,
    marginTop: 15,
    width: '100%',
    backgroundColor: '#F2F2F2',
    borderRadius: 5,
    overflow: 'hidden',
  },
  deliveryStatusBarForeground: {
    position: 'absolute',
    height: 10,
    backgroundColor: '#6D89B1',
  },
  creditsTitle: {
    fontSize: 20,
    color: Colors.AMEELIO_BLACK,
  },
  creditsResetMessage: {
    fontSize: 14,
    color: Colors.AMEELIO_GRAY,
  },
  creditsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  creditsSendMoreText: {
    flex: 1,
    fontSize: 18,
    color: Colors.PINK_500,
  },
  categoryBackground: {
    height: 200,
    flex: 1,
    padding: 0,
  },
  categoryTitle: {
    fontSize: 18,
  },
  categoryBlurb: {
    color: Colors.GRAY_700,
    fontSize: 14,
  },
  contactSelectorCardBackground: {
    width: (WINDOW_WIDTH - 48) / 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
    marginHorizontal: 8,
  },
  contactSelectorColor: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 64,
  },
  selectPostcardSizeBase: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 16,
    marginVertical: 8,
  },
  cardSelectedBackground: {
    borderWidth: 3,
    borderRadius: 16,
    borderColor: Colors.PINK_500,
  },
  ameelioPlusBackground: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    marginTop: 16,
  },
  premiumCardBox: {
    width: 120,
    height: 160,
    position: 'absolute',
    borderRadius: 4,
    zIndex: 3,
    borderColor: '#DCDCDC',
    borderWidth: 1,
  },
  premiumCardBox2: {
    backgroundColor: Colors.AMEELIO_WHITE,
    elevation: 5,
    top: 16,
    left: 16,
    zIndex: 1,
    borderColor: '#DCDCDC',
    borderWidth: 1,
  },
  premiumCardBox3: {
    backgroundColor: Colors.AMEELIO_WHITE,
    elevation: 4,
    top: 12,
    left: 12,
    zIndex: 2,
    borderColor: '#DCDCDC',
    borderWidth: 1,
  },
  buyHereContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    right: 16,
  },
  tokensLeftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  arrowText: {
    color: Colors.PINK_500,
    fontSize: 32,
    marginTop: 4,
    marginLeft: 4,
  },
  tokensLeftText: {
    fontSize: 36,
    color: Colors.AMEELIO_BLACK,
    height: 52,
    paddingLeft: 8,
    justifyContent: 'center',
  },
  transactionHistoryBackground: {
    flexDirection: 'row',
  },
  transactionHistoryThumbnail: {
    width: 64,
    height: 64,
    marginRight: 16,
    borderRadius: 4,
  },
});
