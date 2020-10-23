import React from 'react';
import { Text, View } from 'react-native';
import { Typography } from '@styles';
import i18n from '@i18n';
import Styles from './ReviewCredits.style';

interface Props {
  type: 'premium' | 'free';
  cost: number;
  balance: number;
}

const ReviewCredits: React.FC<Props> = ({ type, cost, balance }: Props) => {
  let costString = i18n.t('Premium.ameelioPlus');
  if (type === 'free') {
    costString =
      cost === 1 ? i18n.t('Premium.ameelio') : i18n.t('Premium.ameelios');
  }
  let balanceString = i18n.t('Premium.ameelioPlus');
  if (type === 'free') {
    balanceString =
      balance === 1 ? i18n.t('Premium.ameelio') : i18n.t('Premium.ameelios');
  }
  return (
    <View style={Styles.background}>
      <View style={Styles.currencyContainer}>
        <View style={Styles.numContainer}>
          <Text style={[Typography.FONT_REGULAR, Styles.bigNum]}>{cost}</Text>
          <Text style={[Typography.FONT_REGULAR, Styles.smallText]}>
            {costString}
          </Text>
        </View>
        <View style={Styles.numContainer}>
          <Text style={[Typography.FONT_REGULAR, Styles.smallText]}>
            {i18n.t('Premium.balance')}: {balance} {balanceString}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default ReviewCredits;
