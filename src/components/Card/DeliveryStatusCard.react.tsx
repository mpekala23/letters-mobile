import React from "react";
import { Text, TouchableOpacity, ViewStyle, View } from "react-native";
import CardStyles from "./Card.styles";
import { PrisonTypes, LetterStatus } from "types";
import { Card } from "react-native-elements";

interface Props {
  title: string;
  date: string;
  status: LetterStatus;
  onPress: () => void;
  style?: ViewStyle;
}

function mapProgressStyletoStatus(type: String) {
  switch (type) {
    case LetterStatus.Draft:
      return { width: "0%" };
    case LetterStatus.Created:
      return { width: "20%" };
    case LetterStatus.Printed:
      return { width: "40%" };
    case LetterStatus.Mailed:
      return { width: "60%" };
    case LetterStatus.OutForDelivery:
      return { width: "80%" };
    case LetterStatus.Delivered:
      return { width: "100%" };
    default:
      return { width: {} };
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
            mapProgressStyletoStatus(props.status),
          ]}
          testID="progressBar"
        />
      </View>
    </TouchableOpacity>
  );
};

export default DeliveryStatusCard;
