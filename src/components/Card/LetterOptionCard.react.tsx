import React from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';
import LettersIcon from '@assets/components/Card/Letters';
import PostCardsIcon from '@assets/components/Card/PostCards';
import i18n from '@i18n';
import { MailTypes } from 'types';
import { Typography } from '@styles';
import Icon from '../Icon/Icon.react';
import CardStyles from './Card.styles';

interface Props {
  type: MailTypes;
  onPress: () => void;
  style?: ViewStyle;
}

const LetterOptionCard: React.FC<Props> = (props: Props) => {
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
        svg={props.type === MailTypes.Postcard ? PostCardsIcon : LettersIcon}
        style={{ position: 'absolute', right: 0, bottom: 0 }}
      />
      <Text style={[Typography.FONT_BOLD, CardStyles.cardTitle]}>
        {props.type === MailTypes.Postcard
          ? i18n.t('LetterTypes.postCardsTitle')
          : i18n.t('LetterTypes.lettersTitle')}
      </Text>
      <Text style={[CardStyles.cardData, { maxWidth: '65%' }]}>
        {props.type === MailTypes.Postcard
          ? i18n.t('LetterTypes.postCardsDesc')
          : i18n.t('LetterTypes.lettersDesc')}
      </Text>
    </TouchableOpacity>
  );
};

LetterOptionCard.defaultProps = {
  style: {},
};

export default LetterOptionCard;
