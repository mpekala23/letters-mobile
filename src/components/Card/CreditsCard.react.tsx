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
      ? i18n.t('CreditsCard.letter')
      : i18n.t('CreditsCard.letters');
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
              {props.credits === 0
                ? i18n.t('CreditsCard.youUsedAllYourLetters')
                : `${props.credits} ${creditsRemaining} ${i18n.t(
                    'CreditsCard.leftThisWeek'
                  )}`}
            </Text>
            {props.credits === 0 ? (
              <TouchableOpacity onPress={props.onPress}>
                <Text style={CardStyles.creditsSendMoreText}>
                  {i18n.t('CreditsCard.sendMore')}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <Text style={CardStyles.creditsResetMessage}>
            {props.credits === 0
              ? i18n.t('CreditsCard.comeBackOnMondayForMore')
              : i18n.t('CreditsCard.creditsResetDaily')}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CreditsCard;
