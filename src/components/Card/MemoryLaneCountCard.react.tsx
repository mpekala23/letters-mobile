import React from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Typography } from '@styles';
import LettersFilledIcon from '@assets/components/Card/LettersFilled';
import CardStyles from './Card.styles';
import Icon from '../Icon/Icon.react';

interface Props {
  letterCount: number;
  onPress: () => void;
  style?: ViewStyle;
}

const MemoryLaneCardCount: React.FC<Props> = (props: Props) => {
  let cardMessage = 'No letters yet';
  if (props.letterCount === 1) {
    cardMessage = '1 Letter';
  } else if (props.letterCount > 1) {
    cardMessage = `${props.letterCount} Letters`;
  }
  return (
    <TouchableOpacity
      style={[
        CardStyles.cardBase,
        CardStyles.letterOptionsBackground,
        CardStyles.shadow,
        props.style,
      ]}
      onPress={props.onPress}
    >
      <Icon
        svg={LettersFilledIcon}
        style={{ position: 'absolute', right: 0, bottom: 0 }}
      />
      <Text style={[Typography.FONT_MEDIUM, CardStyles.cardData]}>
        Memory Lane
      </Text>
      <Text
        style={
          props.letterCount === 0
            ? [
                Typography.FONT_MEDIUM,
                {
                  fontSize: 26,
                  color: Colors.AMEELIO_BLACK,
                  width: '65%',
                  paddingTop: 4,
                },
              ]
            : [Typography.FONT_MEDIUM, CardStyles.cardTitle]
        }
      >
        {cardMessage}
      </Text>
    </TouchableOpacity>
  );
};

export default MemoryLaneCardCount;
