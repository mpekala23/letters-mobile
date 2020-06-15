import React from "react";
import { Text, TouchableOpacity, ViewStyle } from "react-native";
import CardStyles from "./Card.styles";
import { Colors, Typography } from "@styles";
import { PrisonTypes } from "types";

interface Props {
  name: string;
  type: PrisonTypes;
  address: string;
  onPress: () => void;
  style?: ViewStyle;
}

const PrisonCard: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity style={[CardStyles.cardBase, CardStyles.shadow]}>
      <Text style={CardStyles.cardTitle}>{props.name}</Text>
      <Text style={[CardStyles.cardPrisonData, { marginVertical: 6 }]}>
        {props.type === PrisonTypes.StatePrison
          ? "State Prison"
          : "Federal Prison"}
      </Text>
      <Text style={CardStyles.cardPrisonData}>{props.address}</Text>
    </TouchableOpacity>
  );
};

export default PrisonCard;
