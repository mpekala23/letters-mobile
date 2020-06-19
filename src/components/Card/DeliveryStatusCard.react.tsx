import React from "react";
import { Text, TouchableOpacity, ViewStyle, View } from "react-native";
import CardStyles from "./Card.styles";
import { LetterStatus } from "types";

interface Props {
  title: string;
  date: string;
  status: LetterStatus;
  onPress: () => void;
  style?: ViewStyle;
}

function mapStatusToProgressStyle(type: LetterStatus) {
  switch (type) {
    case LetterStatus.Draft:
      return { style: { width: "0%" } };
    case LetterStatus.Created:
      return { style: { width: "20%" } };
    case LetterStatus.Printed:
      return { style: { width: "40%" } };
    case LetterStatus.Mailed:
      return { style: { width: "60%" } };
    case LetterStatus.OutForDelivery:
      return { style: { width: "80%" } };
    case LetterStatus.Delivered:
      return { style: { width: "100%" } };
    default:
      return { style: { width: "0%" } };
  }
}

const DeliveryStatusCard: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity
      style={[CardStyles.cardBase, CardStyles.shadow, props.style]}
      onPress={props.onPress}
    >
      <View style={CardStyles.deliveryAndDateContainer}>
        <Text style={CardStyles.cardTitle}>{props.title}</Text>
        <Text style={CardStyles.date}>{props.date}</Text>
      </View>
      <Text style={CardStyles.cardData}>{props.status}</Text>
      <View style={CardStyles.deliveryStatusBarBackground}>
        <View
          style={[
            CardStyles.deliveryStatusBarForeground,
            mapStatusToProgressStyle(props.status).style,
          ]}
          testID="progressBar"
        />
      </View>
    </TouchableOpacity>
  );
};

export default DeliveryStatusCard;
