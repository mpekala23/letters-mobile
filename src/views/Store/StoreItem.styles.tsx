import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.AMEELIO_WHITE,
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  line: {
    borderWidth: 1,
    borderColor: Colors.GRAY_200,
    marginTop: 'auto',
  },
});
