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
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 12,
  },
  itemText: {
    flex: 15,
    flexDirection: 'row',
    textAlign: 'left',
    fontSize: 14,
    color: Colors.AMEELIO_BLACK,
    paddingVertical: 4,
    marginRight: 24,
  },
  chevron: {
    flex: 1,
    flexDirection: 'row',
  },
  textPaddingAndroid: {
    paddingTop: 6,
    paddingBottom: 2,
  },
});
