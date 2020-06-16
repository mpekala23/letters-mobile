import React from "react";
import { Text, TouchableOpacity, ViewStyle, View } from "react-native";
import CardStyles from "./Card.styles";
import { PrisonTypes, DeliveryProgress } from "types";
import { Card } from "react-native-elements";

interface Props {
  title: string;
  status: string;
  date: string;
  progress: DeliveryProgress;
  onPress: () => void;
  style?: ViewStyle;
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
            { width: props.progress },
          ]}
          testID="progressBar"
        />
      </View>
    </TouchableOpacity>
  );
};

export default DeliveryStatusCard;
