import React from "react";
import { Text } from "react-native";
import { TextStyle } from "react-native";

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

interface TextProps {
  text: string;
  style?: object;
}
