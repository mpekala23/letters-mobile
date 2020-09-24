import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  headerWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    paddingTop: 8,
  },
  gradientBackground: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    position: 'absolute',
  },
  starsBackground: {
    position: 'absolute',
    width: '100%',
    marginTop: 16,
  },
  impactRowWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  impactContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '33%',
  },
  impactMetric: {
    fontSize: 32,
    color: 'white',
  },
  impactLabel: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
  },
  descWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  descHeader: {
    fontSize: 18,
    marginBottom: 8,
  },
  descContainer: {
    flexShrink: 1,
    flexDirection: 'column',
    marginLeft: 16,
  },
  thanksToYouWrapper: {
    marginTop: 16,
    flexGrow: 1,
  },
});
