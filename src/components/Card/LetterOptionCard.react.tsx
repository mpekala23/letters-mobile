import React from "react";
import { Text, TouchableOpacity, ViewStyle } from "react-native";
import CardStyles from "./Card.styles";
import LettersIcon from "@assets/components/Card/Letters";
import PostCardsIcon from "@assets/components/Card/PostCards";
import { Icon } from "@components";

interface Props {
  title: "Post cards" | "Letters";
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
      <Icon
        svg={props.title === "Post cards" ? PostCardsIcon : LettersIcon}
        style={{ position: "absolute", right: 0, bottom: 0 }}
      />
      <Text style={CardStyles.cardTitle}>{props.title}</Text>
      <Text style={CardStyles.cardData}>{props.description}</Text>
    </TouchableOpacity>
  );
};

export default LetterOptionCard;
