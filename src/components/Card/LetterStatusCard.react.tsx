import React from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
import CardStyles from "./Card.styles";
import { LetterStatus } from "types";

interface Props {
  status: LetterStatus;
  date: string;
  description: string;
  onPress: () => void;
  style?: ViewStyle;
}

function mapStatusToColorStyle(type: LetterStatus) {
  switch (type) {
    case LetterStatus.Draft:
      return { style: { backgroundColor: "#81B5FF" } };
    case LetterStatus.Created:
      return { style: { backgroundColor: "#81B5FF" } };
    case LetterStatus.Printed:
      return { style: { backgroundColor: "#7DF5AD" } };
    case LetterStatus.Mailed:
      return { style: { backgroundColor: "#81B5FF" } };
    case LetterStatus.OutForDelivery:
      return { style: { backgroundColor: "#FF7171" } };
    default:
      return { style: { backgroundColor: "#FF7171" } };
  }
}

const LetterStatusCard: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity
      style={[CardStyles.cardBase, CardStyles.shadow, props.style]}
      onPress={props.onPress}
    >
      <View style={CardStyles.letterStatusBackground}>
        <View
          style={[
            CardStyles.letterStatusBar,
            mapStatusToColorStyle(props.status).style,
          ]}
        />
        <View style={{ flex: 1 }}>
          <View style={CardStyles.statusAndDateContainer}>
            <Text style={[CardStyles.cardTitle, { flex: 1 }]}>
              {props.status}
            </Text>
            <Text style={CardStyles.date}>{props.date}</Text>
          </View>
          <Text style={CardStyles.cardData}>{props.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LetterStatusCard;
