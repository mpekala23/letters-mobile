import React from "react";
import { Text, TouchableOpacity, ViewStyle } from "react-native";
import CardStyles from "./Card.styles";
import LettersIcon from "@assets/components/Card/Letters";
import PostCardsIcon from "@assets/components/Card/PostCards";
import Icon from "../Icon/Icon.react";
import { i18n } from "@i18n";
import { LetterTypes } from "types";

interface Props {
  type: LetterTypes;
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
        svg={props.type === LetterTypes.PostCards ? PostCardsIcon : LettersIcon}
        style={{ position: "absolute", right: 0, bottom: 0 }}
      />
      <Text style={CardStyles.cardTitle}>
        {props.type === LetterTypes.PostCards
          ? i18n.t("LetterTypes.postCardsTitle")
          : i18n.t("LetterTypes.lettersTitle")}
      </Text>
      <Text style={CardStyles.cardData}>
        {props.type === LetterTypes.PostCards
          ? i18n.t("LetterTypes.postCardsDesc")
          : i18n.t("LetterTypes.lettersDesc")}
      </Text>
    </TouchableOpacity>
  );
};

export default LetterOptionCard;
