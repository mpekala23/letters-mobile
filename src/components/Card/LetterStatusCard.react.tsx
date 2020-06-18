import React from "react";
import { Text, TouchableOpacity, View, ViewStyle } from "react-native";
import CardStyles from "./Card.styles";
import { LetterStatus } from "types";

interface Props {
  status: string;
  date: string;
  description: string;
  onPress: () => void;
  style?: ViewStyle;
}

function mapColorStyletoStatus(type: String) {
  switch (type) {
    case LetterStatus.Draft:
      return { backgroundColor: "#81B5FF" };
    case LetterStatus.Created:
      return { backgroundColor: "#81B5FF" };
    case LetterStatus.Printed:
      return { backgroundColor: "#7DF5AD" };
    case LetterStatus.Mailed:
      return { backgroundColor: "#81B5FF" };
    case LetterStatus.OutForDelivery:
      return { backgroundColor: "#FF7171" };
    default:
      return { backgroundColor: {} };
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
            mapColorStyletoStatus(props.status),
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
