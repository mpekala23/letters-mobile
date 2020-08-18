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
      return { backgroundColor: Colors.GREEN_LIGHTEST };
    case MailStatus.Mailed:
      return { backgroundColor: Colors.GREEN_LIGHTER };
    case MailStatus.InTransit:
      return { backgroundColor: Colors.GREEN_LIGHT };
    case MailStatus.InLocalArea:
      return { backgroundColor: Colors.GREEN_DARK };
    case MailStatus.ProcessedForDelivery:
      return { backgroundColor: Colors.GREEN_DARKER };
    case MailStatus.Delivered:
      return { backgroundColor: Colors.GREEN_DARKEST };
    case MailStatus.ReturnedToSender:
      return { backgroundColor: Colors.AMEELIO_RED };
    default:
      return { backgroundColor: Colors.GREEN_LIGHTEST };
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
