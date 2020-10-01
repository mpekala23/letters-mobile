import React from 'react';
import { ViewStyle, Text, TextStyle } from 'react-native';

interface Props {
  style?: ViewStyle | ViewStyle[] | TextStyle | TextStyle[];
  numberOfLines: number;
  children: React.ReactNode;
}
const AdjustableText: React.FC<Props> = ({
  children,
  numberOfLines,
  style,
}: Props): JSX.Element => {
  return (
    <Text numberOfLines={numberOfLines} adjustsFontSizeToFit style={style}>
      {children}
    </Text>
  );
};

AdjustableText.defaultProps = {
  style: {},
};

export default AdjustableText;
