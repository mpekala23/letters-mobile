import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle, Image } from 'react-native';
import { format } from 'date-fns';
import CardStyles from './Card.styles';

interface Props {
  text: string;
  date?: Date;
  imageUri: string;
  onPress: () => void;
  style?: ViewStyle;
}

const MemoryLaneCard: React.FC<Props> = (props: Props) => {
  const letterDate = props.date ? format(props.date, 'MMMM d') : '';
  return (
    <TouchableOpacity
      style={[
        CardStyles.cardBase,
        CardStyles.memoryLaneBackground,
        CardStyles.shadow,
        props.style,
      ]}
      onPress={props.onPress}
      testID="memoryLaneCard"
    >
      {props.imageUri.length > 0 && (
        <Image
          style={CardStyles.memoryLanePicture}
          source={{ uri: props.imageUri }}
          testID="memoryLaneImage"
        />
      )}
      <View style={CardStyles.memoryLaneTextBackground}>
        <Text
          style={[
            CardStyles.memoryLaneText,
            { height: props.imageUri ? 65 : 150 },
          ]}
        >
          {props.text}
        </Text>
      </View>
      <View style={CardStyles.memoryLaneTextBackground}>
        <Text style={[CardStyles.date, { marginTop: 6 }]}>{letterDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MemoryLaneCard;
