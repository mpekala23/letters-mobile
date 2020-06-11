import React from "react";
import { Text, View } from "react-native";
import { TextStyle } from "react-native";
import * as Colors from "./Colors";

// FONT FAMILY
export const FONT_FAMILY_REGULAR = "System";
export const FONT_FAMILY_BOLD = "System";

// FONT WEIGHT
export const FONT_WEIGHT_REGULAR = "400";
export const FONT_WEIGHT_BOLD = "600";

// FONT STYLE
export const FONT_REGULAR: TextStyle = {
  fontFamily: FONT_FAMILY_REGULAR,
  fontWeight: FONT_WEIGHT_REGULAR,
  fontSize: 16,
};

export const FONT_BOLD: TextStyle = {
  fontFamily: FONT_FAMILY_BOLD,
  fontWeight: FONT_WEIGHT_BOLD,
};

export const FONT_ITALIC: TextStyle = {
  fontFamily: FONT_FAMILY_REGULAR,
  fontWeight: FONT_WEIGHT_REGULAR,
  fontStyle: "italic",
};

export interface TextProps {
  text: string;
  size?: number;
  color?: string;
}

const PageHeader: React.FC<TextProps> = (props: TextProps) => {
  const text = props.text;
  const size = props.size || 20;
  const color = props.color || Colors.AMEELIO_BLUE;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
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
          fontWeight: FONT_WEIGHT_BOLD,
        }}
      >
        {props.text}
      </Text>
    </View>
  );
};

export { PageHeader };
