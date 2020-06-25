import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import CardStyles from './Card.styles';

interface Props {
  onPress?: () => void;
  style?: ViewStyle;
  children?: JSX.Element | JSX.Element[];
}

const GenericCard: React.FC<Props> = (props: Props) => {
  return props.onPress ? (
    <TouchableOpacity
      style={[
        CardStyles.cardBase,
        CardStyles.letterOptionsBackground,
        CardStyles.shadow,
        props.style,
      ]}
      onPress={props.onPress}
    >
      {props.children}
    </TouchableOpacity>
  ) : (
    <View
      style={[
        CardStyles.cardBase,
        CardStyles.letterOptionsBackground,
        CardStyles.shadow,
        props.style,
      ]}
    >
      {props.children}
    </View>
  );
};

export default GenericCard;
