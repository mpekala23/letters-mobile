import React from "react";
import { Text, TouchableOpacity, ViewStyle } from "react-native";
import CardStyles from "./Card.styles";
import { PrisonTypes } from "types";
import { i18n } from "i18n";

interface Props {
  name: string;
  type: PrisonTypes;
  address: string;
  onPress: () => void;
  style?: ViewStyle;
}

const PrisonCard: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity
      style={[CardStyles.cardBase, CardStyles.shadow, props.style]}
      onPress={props.onPress}
    >
      <Text style={CardStyles.cardTitle}>{props.name}</Text>
      <Text style={[CardStyles.cardData, { marginVertical: 6 }]}>
        {props.type === PrisonTypes.State
          ? i18n.t("PrisonTypes.state")
          : i18n.t("PrisonTypes.federal")}
      </Text>
      <Text style={CardStyles.cardData}>{props.address}</Text>
    </TouchableOpacity>
  );
};

export default PrisonCard;
