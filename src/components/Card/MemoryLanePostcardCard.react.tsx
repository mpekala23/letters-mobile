import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  ImageBackground,
} from 'react-native';
import { Typography } from '@styles';
import { format } from 'date-fns';
import CardStyles from './Card.styles';

interface Props {
  date?: Date;
  imageUri: string;
  onPress: () => void;
  style?: ViewStyle;
}

const MemoryLanePostcardCard: React.FC<Props> = (props: Props) => {
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
      testID="memoryLanePostcardCard"
    >
      {props.imageUri.length > 0 && (
        <ImageBackground
          style={CardStyles.memoryLanePostcardPicture}
          source={{ uri: props.imageUri }}
          imageStyle={{ borderRadius: 6 }}
          testID="memoryLanePostcardImage"
        >
          <View
            style={[
              CardStyles.memoryLaneTextBackground,
              CardStyles.memoryLanePostcardBackground,
            ]}
          >
            <Text
              style={[CardStyles.memoryLanePostcardDate, Typography.FONT_BOLD]}
            >
              {letterDate}
            </Text>
          </View>
        </ImageBackground>
      )}
    </TouchableOpacity>
  );
};

export default MemoryLanePostcardCard;
