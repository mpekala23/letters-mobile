import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { LetterStatus } from 'types';
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
      return { backgroundColor: '#81B5FF' };
    case LetterStatus.Created:
      return { backgroundColor: '#81B5FF' };
    case LetterStatus.Mailed:
      return { backgroundColor: '#A8C1E4' };
    case LetterStatus.InTransit:
      return { backgroundColor: '#8DA7CC' };
    case LetterStatus.InLocalArea:
      return { backgroundColor: '#6D89B1' };
    case LetterStatus.OutForDelivery:
      return { backgroundColor: '#436697' };
    default:
      return { backgroundColor: '#FF7171' };
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
