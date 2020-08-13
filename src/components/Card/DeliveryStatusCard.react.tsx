import React from 'react';
import { Text, TouchableOpacity, ViewStyle, View } from 'react-native';
import { MailStatus } from 'types';
import CardStyles from './Card.styles';

interface Props {
  title: string;
  date: string;
  status: MailStatus;
  onPress: () => void;
  style?: ViewStyle;
}

function mapStatusToProgressStyle(type: MailStatus) {
  switch (type) {
    case MailStatus.Draft:
      return { width: '0%' };
    case MailStatus.Created:
      return { width: '20%' };
    case MailStatus.Mailed:
      return { width: '40%' };
    case MailStatus.InTransit:
      return { width: '60%' };
    case MailStatus.ProcessedForDelivery:
      return { width: '80%' };
    case MailStatus.Delivered:
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
