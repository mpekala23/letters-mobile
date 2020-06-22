import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

const barHeight = 50;

export default StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: barHeight,
    borderColor: Colors.GRAY_MEDIUM,
    borderBottomWidth: 0.5,
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  logoContainer: {
    flex: 1,
    height: barHeight,
  },
  logo: {
    height: barHeight + 5,
    aspectRatio: 2015 / 885,
    marginTop: -5,
  },
});
