import React from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Typography } from '@styles';
import LettersFilledIcon from '@assets/components/Card/LettersFilled';
import i18n from '@i18n';
import CardStyles from './Card.styles';
import Icon from '../Icon/Icon.react';

interface Props {
  letterCount: number;
  onPress: () => void;
  style?: ViewStyle;
}

const MemoryLaneCardCount: React.FC<Props> = (props: Props) => {

  let cardMessage = i18n.t('MemoryLaneCountCard.noLettersYet');
  if (props.letterCount === 1) {
    cardMessage = i18n.t('MemoryLaneCountCard.oneLetter');
  } else if (props.letterCount > 1) {
    cardMessage = `${props.letterCount} ${i18n.t(
      'MemoryLaneCountCard.letters'
    )}`;
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
                Typography.FONT_BOLD,
                {
                  fontSize: 26,
                  color: Colors.AMEELIO_BLACK,
                  width: '65%',
                  paddingTop: 4,
                },
              ]
            : [Typography.FONT_BOLD, CardStyles.cardTitle]
        }
      >
        {cardMessage}
      </Text>
    </TouchableOpacity>
  );
};

export default MemoryLaneCardCount;
