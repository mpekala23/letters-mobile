import React from 'react';
import { Text, View, TextStyle } from 'react-native';

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

// BASE STYLE
export const BASE_TITLE: TextStyle = {
  fontFamily: FONT_FAMILY_BOLD,
  fontSize: 20,
};

export const BASE_TEXT: TextStyle = {
  fontFamily: FONT_FAMILY_REGULAR,
  fontSize: 16,
};

export interface TextProps {
  text: string;
  size?: number;
  color?: string;
}

const PageHeader: React.FC<TextProps> = (props: TextProps) => {
  const { text } = props;
  const size = props.size || 24;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text
        style={{
          fontSize: size,
          fontFamily: FONT_FAMILY_BOLD,
        }}
      >
        {text}
      </Text>
    </View>
  );
};

export { PageHeader };
