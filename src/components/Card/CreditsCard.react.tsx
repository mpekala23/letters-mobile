import React from 'react';
import { Text, View, ViewStyle, TouchableOpacity } from 'react-native';
import { Typography } from '@styles';
import i18n from '@i18n';
import CardStyles from './Card.styles';

interface Props {
  credits: number;
  onPress: () => void;
  style?: ViewStyle;
}

const CreditsCard: React.FC<Props> = (props: Props) => {
  const creditsRemaining =
    props.credits === 1
      ? i18n.t('CreditsCard.credit')
      : i18n.t('CreditsCard.credits');
  return (
    <View
      style={[CardStyles.cardBase, CardStyles.shadow, props.style]}
      testID="creditsCard"
    >
      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1 }}>
          <View style={CardStyles.creditsContainer}>
            <Text
              style={[
                Typography.FONT_BOLD,
                CardStyles.creditsTitle,
                { flex: 1 },
              ]}
            >
              {props.credits} {creditsRemaining} {i18n.t('CreditsCard.left')}
            </Text>
            <TouchableOpacity onPress={props.onPress}>
              <Text style={CardStyles.creditsAddMoreText}>
                {i18n.t('CreditsCard.addMore')}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={CardStyles.creditsResetMessage}>
            {i18n.t('CreditsCard.creditsResetDaily')}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CreditsCard;
