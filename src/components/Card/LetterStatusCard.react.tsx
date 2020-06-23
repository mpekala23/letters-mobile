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
    case LetterStatus.Printed:
      return { backgroundColor: '#7DF5AD' };
    case LetterStatus.Mailed:
      return { backgroundColor: '#81B5FF' };
    case LetterStatus.OutForDelivery:
      return { backgroundColor: '#FF7171' };
    default:
      return { backgroundColor: '#FF7171' };
  }
}

const LetterStatusCard: React.FC<Props> = (props: Props) => {
  return (
    <TouchableOpacity
      style={[CardStyles.cardBase, CardStyles.shadow, props.style]}
      onPress={props.onPress}
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
