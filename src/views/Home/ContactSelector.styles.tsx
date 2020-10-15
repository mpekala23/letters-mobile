import { StyleSheet } from 'react-native';
import { Colors } from '@styles';
import { WINDOW_WIDTH } from '@utils/Constants';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    backgroundColor: '#EDEDED',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 130,
    marginBottom: 16,
    paddingBottom: 4,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 1.8,
    elevation: 4,
  },
  contactCardInfo: {
    color: Colors.GRAY_DARKER,
    fontSize: 16,
  },
  addContactButton: {
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  referralCardBackground: {
    width: WINDOW_WIDTH - 32,
    paddingVertical: 16,
    height: 150,
    overflow: 'hidden',
    borderRadius: 8,
    marginBottom: 8,
  },
  referralCardBackgroundIllustration: {
    position: 'absolute',
    marginTop: 8,
  },
  referralCardBgGradient: {
    height: 150,
    width: '100%',
    position: 'absolute',
  },
  referralCardButton: {
    alignSelf: 'flex-end',
  },
  referralCardDesc: {
    marginLeft: 16,
  },
  referralCardTitle: {
    color: Colors.AMEELIO_WHITE,
    fontSize: 20,
  },
  referralCardSubtitle: {
    color: Colors.AMEELIO_WHITE,
  },
  referralCardCta: {
    alignSelf: 'flex-start',
    color: Colors.AMEELIO_BLACK,
    marginTop: 24,
  },
});
