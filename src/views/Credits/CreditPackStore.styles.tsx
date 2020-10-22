import { Colors } from '@styles';
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  trueBackground: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.AMEELIO_WHITE,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.GRAY_600,
  },
  cardBase: {
    borderRadius: 12,
    flexDirection: 'row',
    padding: 16,
    width: '100%',
    marginBottom: 16,
    alignItems: 'center',
  },
  cardSelectedBackground: {
    borderWidth: 3,
    borderColor: Colors.PINK_500,
  },
  cardRegularBackground: {
    borderWidth: 2,
    borderColor: Colors.GRAY_200,
  },
  cardTitle: {
    fontSize: 18,
  },
  cardBodyText: {
    color: Colors.GRAY_400,
  },
});
