import React from "react";
import { Text, TouchableOpacity, ViewStyle, View } from "react-native";
import CardStyles from "./Card.styles";
import { PrisonTypes } from "types";
import { Card } from "react-native-elements";

interface Props {
  title: string;
  status: string;
  date: string;
  progress: number;
  onPress: () => void;
  style?: ViewStyle;
}

function mapProgressToWidth(progress: number) {
  switch (progress) {
    case 0:
      return "0%";
    case 1:
      return "25%";
    case 2:
      return "50%";
    case 3:
      return "75%";
    case 4:
      return "100%";
    default:
      return "0%";
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
            { width: mapProgressToWidth(props.progress) },
          ]}
          testID="progressBar"
        />
      </View>
    </TouchableOpacity>
  );
};

export default DeliveryStatusCard;
