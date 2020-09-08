import React, { ReactElement, useState } from 'react';
import { ViewStyle, Text } from 'react-native';

interface Props {
  text: string;
  style: ViewStyle | ViewStyle[];
  numberOfLines: number;
}
export default function AdjustableText({
  text,
  style,
  numberOfLines,
}: Props): ReactElement {
  return (
    <Text numberOfLines={numberOfLines} adjustsFontSizeToFit style={[style]}>
      {text}
    </Text>
  );
}
