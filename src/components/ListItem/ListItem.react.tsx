import React from 'react';
import {
  TouchableHighlight,
  Text,
  TextStyle,
  View,
  ViewStyle,
  Platform,
} from 'react-native';
import { Typography, Colors } from '@styles';
import Entypo from 'react-native-vector-icons/Entypo';
import Styles from './ListItem.styles';

export interface Props {
  containerStyle?: ViewStyle | ViewStyle[];
  textStyle?: Record<string, unknown> | TextStyle | TextStyle[];
  itemText?: string;
  onPress: () => void;
  children?: JSX.Element | JSX.Element[];
}

const ListItem: React.FC<Props> = (props: Props) => {
  const { itemText, textStyle, containerStyle, onPress, children } = props;

  const chevron = (
    <Entypo
      name="chevron-thin-right"
      size={18}
      color="#B9B9B9"
      style={Styles.chevron}
    />
  );

  return (
    <TouchableHighlight
      style={[Styles.itemContainer, containerStyle]}
      underlayColor={Colors.BLACK_200}
      onPress={onPress}
    >
      <View style={Styles.itemView}>
        {itemText ? (
          <Text
            style={[
              Typography.FONT_REGULAR,
              Styles.itemText,
              Platform.OS === 'android' ? Styles.textPaddingAndroid : {},
              textStyle,
            ]}
          >
            {itemText}
          </Text>
        ) : (
          children
        )}
        {chevron}
      </View>
    </TouchableHighlight>
  );
};

ListItem.defaultProps = {
  textStyle: {},
  containerStyle: {},
  onPress: () => null,
};

export default ListItem;
