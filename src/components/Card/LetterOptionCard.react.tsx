import React from 'react';
import {
  Image as ImageComponent,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import PhotosBanner from '@assets/views/ChooseOptions/PhotosBanner.png';
import LettersBanner from '@assets/views/ChooseOptions/LettersBanner.png';

import i18n from '@i18n';
import { MailTypes } from 'types';
import { Typography } from '@styles';
import { LinearGradient } from 'expo-linear-gradient';
import CardStyles from './Card.styles';
import AdjustableText from '../Text/AdjustableText.react';

interface Props {
  type: MailTypes;
  onPress: () => void;
  style?: ViewStyle;
}

const LetterOptionCard: React.FC<Props> = (props: Props) => {
  return (
    <View style={{ flex: 1, padding: 8 }}>
      <TouchableOpacity
        style={[
          CardStyles.cardBase,
          CardStyles.categoryBackground,
          CardStyles.shadow,
          props.style,
        ]}
        onPress={() => props.onPress()}
      >
        <View>
          <LinearGradient
            style={{ width: '100%', height: 125 }}
            colors={
              props.type === MailTypes.Postcard
                ? ['#E3F2FF', '#94c6f3']
                : ['#FFEFE3', '#f6ecc1']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          />
          <ImageComponent
            source={
              props.type === MailTypes.Postcard ? PhotosBanner : LettersBanner
            }
            style={{
              position: 'absolute',
              resizeMode: 'cover',
              width: 195,
              height: 136,
              top: 8,
              right: 8,
            }}
          />
        </View>

        <View style={{ padding: 16, justifyContent: 'center' }}>
          <AdjustableText
            style={[Typography.FONT_SEMIBOLD, CardStyles.categoryTitle]}
            numberOfLines={1}
          >
            {props.type === MailTypes.Postcard
              ? i18n.t('LetterTypes.postCardsTitle')
              : i18n.t('LetterTypes.lettersTitle')}
          </AdjustableText>
          <AdjustableText
            style={[Typography.FONT_REGULAR, CardStyles.categoryBlurb]}
            numberOfLines={1}
          >
            {props.type === MailTypes.Postcard
              ? i18n.t('LetterTypes.postCardsDesc')
              : i18n.t('LetterTypes.lettersDesc')}
          </AdjustableText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

LetterOptionCard.defaultProps = {
  style: {},
};

export default LetterOptionCard;
