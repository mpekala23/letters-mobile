import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import CardStyles from './Card.styles';

interface Props {
  status: string;
  date: string;
  description: string;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
}

const LetterStatusCard: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity
      style={[CardStyles.cardBase, CardStyles.shadow, props.style]}
      onPress={props.onPress}
    >
      <View style={CardStyles.letterStatusBackground}>
        <View
          style={[CardStyles.letterStatusBar, { backgroundColor: props.color }]}
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
