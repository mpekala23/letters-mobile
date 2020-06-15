import React from "react";
import { Text, TouchableOpacity, ViewStyle } from "react-native";
import CardStyles from "./Card.styles";
import { PrisonTypes } from "types";

interface Props {
  title: string;
  description: string;
  onPress: () => void;
  style?: ViewStyle;
}

const LetterOptionCard: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity
      style={[
        CardStyles.cardBase,
        CardStyles.letterOptionsBackground,
        CardStyles.shadow,
        props.style,
      ]}
      onPress={props.onPress}
    >
      <Text style={CardStyles.cardTitle}>{props.title}</Text>
      <Text style={CardStyles.cardData}>{props.description}</Text>
    </TouchableOpacity>
  );
};

export default LetterOptionCard;
