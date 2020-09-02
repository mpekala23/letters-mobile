import { StyleSheet } from 'react-native';
import { Colors } from '@styles';

export default StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
    alignItems: 'center',
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  itemText: {
    flex: 14,
    textAlign: 'left',
    fontSize: 14,
    color: Colors.AMEELIO_BLACK,
    paddingVertical: 4,
  },
  chevron: {
    flex: 2,
    textAlign: 'right',
  },
  textPaddingAndroid: {
    paddingTop: 6,
    paddingBottom: 2,
  },
});
