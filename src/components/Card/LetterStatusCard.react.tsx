import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { MailStatus } from 'types';
import { Colors, Typography } from '@styles';
import { format } from 'date-fns';
import CardStyles from './Card.styles';

interface Props {
  status: MailStatus;
  date?: Date;
  description: string;
  onPress: () => void;
  style?: ViewStyle;
}

function mapStatusToColorStyle(type: MailStatus) {
  switch (type) {
    case MailStatus.Created:
      return { backgroundColor: Colors.BLUE_100 };
    case MailStatus.Mailed:
      return { backgroundColor: Colors.BLUE_200 };
    case MailStatus.InTransit:
      return { backgroundColor: Colors.BLUE_300 };
    case MailStatus.InLocalArea:
      return { backgroundColor: Colors.BLUE_400 };
    case MailStatus.ProcessedForDelivery:
      return { backgroundColor: Colors.BLUE_500 };
    case MailStatus.Delivered:
      return { backgroundColor: Colors.BLUE_600 };
    case MailStatus.ReturnedToSender:
      return { backgroundColor: Colors.AMEELIO_RED };
    default:
      return { backgroundColor: Colors.BLUE_100 };
  }
}

const LetterStatusCard: React.FC<Props> = (props: Props) => {
  return (
    <TouchableOpacity
      style={[CardStyles.cardBase, CardStyles.shadow, props.style]}
      onPress={props.onPress}
      testID="letterStatusCard"
    >
      <View style={CardStyles.letterStatusBackground}>
        <View
          style={[
            CardStyles.letterStatusBar,
            mapStatusToColorStyle(props.status),
          ]}
        />
        <View style={{ flex: 1 }}>
          <View style={CardStyles.statusAndDateContainer}>
            <Text
              style={[
                Typography.FONT_BOLD,
                CardStyles.letterStatusTitle,
                { flex: 1 },
              ]}
            >
              {props.status}
            </Text>
            <Text style={CardStyles.date}>
              {props.date ? format(props.date, 'MMM dd, yyyy') : ''}
            </Text>
          </View>
          <Text numberOfLines={1} style={CardStyles.letterStatusData}>
            {props.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

LetterStatusCard.defaultProps = {
  date: new Date(),
  style: {},
};

export default LetterStatusCard;
