import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle, Image } from 'react-native';
import CardStyles from './Card.styles';

interface Props {
  text: string;
  date: string;
  imageUri: string;
  onPress: () => void;
  style?: ViewStyle;
}

const MemoryLaneCard: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity
      style={[
        CardStyles.cardBase,
        CardStyles.memoryLaneBackground,
        CardStyles.shadow,
        props.style,
      ]}
      onPress={props.onPress}
    >
      <Image
        style={CardStyles.memoryLanePicture}
        source={{
          uri: props.imageUri,
        }}
        testID="memoryLaneImage"
      />
      <View style={CardStyles.memoryLaneTextBackground}>
        <Text style={CardStyles.memoryLaneText}>{props.text}</Text>
        <Text style={[CardStyles.date, { marginTop: 6 }]}>{props.date}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MemoryLaneCard;
