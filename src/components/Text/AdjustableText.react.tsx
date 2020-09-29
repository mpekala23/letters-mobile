import React, { ReactElement } from 'react';
import { ViewStyle, Text, TextStyle } from 'react-native';

interface Props {
  style: ViewStyle | ViewStyle[] | TextStyle | TextStyle[];
  numberOfLines: number;
  children: React.ReactNode;
}
export default function AdjustableText({
  children,
  style,
  numberOfLines,
}: Props): ReactElement {
  return (
    <Text numberOfLines={numberOfLines} adjustsFontSizeToFit style={[style]}>
      {children}
    </Text>
  );
}
