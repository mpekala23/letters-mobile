import React from 'react';
import { Text, TouchableOpacity, View, ViewStyle, Image } from 'react-native';
import Default from '@assets/views/Onboarding/DefaultMemoryPreview.png';
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
  const letterDate = props.date ? format(props.date, 'MMM dd, yyyy') : '';
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
      <Image
        style={CardStyles.memoryLanePicture}
        source={
          props.imageUri
            ? {
                uri: props.imageUri,
              }
            : Default
        }
        testID="memoryLaneImage"
      />
      <View style={CardStyles.memoryLaneTextBackground}>
        <Text style={CardStyles.memoryLaneText}>{props.text}</Text>
        <Text style={[CardStyles.date, { marginTop: 6 }]}>{letterDate}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MemoryLaneCard;
