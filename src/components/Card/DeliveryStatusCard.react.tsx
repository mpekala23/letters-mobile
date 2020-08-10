import React from 'react';
import { Text, TouchableOpacity, ViewStyle, View } from 'react-native';
import { LetterStatus } from 'types';
import CardStyles from './Card.styles';

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
      return { width: '0%' };
    case LetterStatus.Created:
      return { width: '20%' };
    case LetterStatus.Mailed:
      return { width: '40%' };
    case LetterStatus.InTransit:
      return { width: '60%' };
    case LetterStatus.ProcessedForDelivery:
      return { width: '80%' };
    case LetterStatus.Delivered:
      return { width: '100%' };
    default:
      return { width: '0%' };
  }
}

const DeliveryStatusCard: React.FC<Props> = (props: Props) => {
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
            mapStatusToProgressStyle(props.status),
          ]}
          testID="progressBar"
        />
      </View>
    </TouchableOpacity>
  );
};

DeliveryStatusCard.defaultProps = {
  style: {},
};

export default DeliveryStatusCard;
