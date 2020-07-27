import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { LetterStatus } from 'types';
import { Colors, Typography } from '@styles';
import moment from 'moment';
import CardStyles from './Card.styles';

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
      return { backgroundColor: Colors.GREEN_LIGHTEST };
    case LetterStatus.Created:
      return { backgroundColor: Colors.GREEN_LIGHTER };
    case LetterStatus.Mailed:
      return { backgroundColor: Colors.GREEN_LIGHT };
    case LetterStatus.InTransit:
      return { backgroundColor: Colors.GREEN_DARK };
    case LetterStatus.InLocalArea:
      return { backgroundColor: Colors.GREEN_DARKER };
    case LetterStatus.OutForDelivery:
      return { backgroundColor: Colors.GREEN_DARKEST };
    default:
      return { backgroundColor: '' };
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
              {moment(new Date(props.date)).format('MMM DD, YYYY')}
            </Text>
          </View>
          <Text style={CardStyles.letterStatusData}>{props.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default LetterStatusCard;
