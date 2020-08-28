import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  Image,
  ImageBackground,
} from 'react-native';
import { format } from 'date-fns';
import { MailTypes } from 'types';
import { Typography } from '@styles';
import CardStyles from './Card.styles';

interface Props {
  type: MailTypes;
  text: string;
  date?: Date;
  imageUri: string;
  onPress: () => void;
  style?: ViewStyle;
}

const MemoryLaneCard: React.FC<Props> = (props: Props) => {
  const letterDate = props.date ? format(props.date, 'MMMM d') : '';
  const hasImage = props.imageUri.length > 0;

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
      {props.type === MailTypes.Postcard && props.imageUri.length ? (
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
              style={[
                CardStyles.memoryLanePostcardDate,
                Typography.FONT_SEMIBOLD,
              ]}
            >
              {letterDate}
            </Text>
          </View>
        </ImageBackground>
      ) : (
        <View>
          {hasImage && (
            <Image
              style={CardStyles.memoryLanePicture}
              source={{ uri: props.imageUri }}
              testID="memoryLaneImage"
            />
          )}
          <View style={CardStyles.memoryLaneTextBackground}>
            <Text
              style={[
                Typography.FONT_MEDIUM,
                CardStyles.memoryLaneText,
                { height: props.imageUri ? 65 : 170 },
              ]}
              numberOfLines={props.imageUri ? 2 : 6}
            >
              {props.text}
            </Text>
          </View>
          <View style={CardStyles.memoryLaneTextBackground}>
            <Text style={[CardStyles.date, { marginTop: 6 }]}>
              {letterDate}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

MemoryLaneCard.defaultProps = {
  date: new Date(),
  style: {},
};

export default MemoryLaneCard;
