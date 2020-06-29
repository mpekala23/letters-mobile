import React from 'react';
import { Text, View, TextStyle } from 'react-native';

import * as Colors from './Colors';

// FONT FAMILY
export const FONT_FAMILY_LIGHT = 'Poppins-Light';
export const FONT_FAMILY_LIGHT_ITALIC = 'Poppins-Light-Italic';

export const FONT_FAMILY_REGULAR = 'Poppins-Regular';
export const FONT_FAMILY_REGULAR_ITALIC = 'Poppins-Regular-Italic';

export const FONT_FAMILY_MEDIUM = 'Poppins-Medium';
export const FONT_FAMILY_MEDIUM_ITALIC = 'Poppins-Medium-Italic';

export const FONT_FAMILY_BOLD = 'Poppins-Bold';
export const FONT_FAMILY_BOLD_ITALIC = 'Poppins-Bold-Italic';

// FONT STYLE
export const FONT_LIGHT: TextStyle = {
  fontFamily: FONT_FAMILY_LIGHT,
};

export const FONT_LIGHT_ITALIC: TextStyle = {
  fontFamily: FONT_FAMILY_LIGHT_ITALIC,
};

export const FONT_REGULAR: TextStyle = {
  fontFamily: FONT_FAMILY_REGULAR,
};

export const FONT_REGULAR_ITALIC: TextStyle = {
  fontFamily: FONT_FAMILY_REGULAR_ITALIC,
};

export const FONT_MEDIUM: TextStyle = {
  fontFamily: FONT_FAMILY_MEDIUM,
};

export const FONT_MEDIUM_ITALIC: TextStyle = {
  fontFamily: FONT_FAMILY_MEDIUM_ITALIC,
};

export const FONT_BOLD: TextStyle = {
  fontFamily: FONT_FAMILY_BOLD,
};

export const FONT_BOLD_ITALIC: TextStyle = {
  fontFamily: FONT_FAMILY_BOLD_ITALIC,
};

export interface TextProps {
  text: string;
  size?: number;
  color?: string;
}

const PageHeader: React.FC<TextProps> = (props: TextProps) => {
  const { text } = props;
  const size = props.size || 20;
  const color = props.color || Colors.AMEELIO_BLUE;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View
        style={{
          width: size,
          height: size / 2,
          borderTopRightRadius: size / 4,
          borderBottomRightRadius: size / 4,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
      <Text
        style={{
          fontSize: size * 1.5,
          fontFamily: FONT_FAMILY_BOLD,
        }}
      >
        {text}
      </Text>
    </View>
  );
};

export { PageHeader };
