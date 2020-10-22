import React from 'react';
import { Text, View } from 'react-native';
import { Typography } from '@styles';
import i18n from '@i18n';
import Styles from './ReviewCredits.style';

interface Props {
  ameelioCost?: number;
  ameelioBalance?: number;
  plusCost?: number;
  plusBalance?: number;
}

const ReviewCredits: React.FC<Props> = ({
  ameelioCost,
  ameelioBalance,
  plusCost,
  plusBalance,
}: Props) => {
  return (
    <View style={Styles.background}>
      {ameelioCost !== undefined && ameelioBalance !== undefined ? (
        <View style={Styles.currencyContainer}>
          <View style={Styles.numContainer}>
            <Text style={[Typography.FONT_REGULAR, Styles.bigNum]}>
              {ameelioCost}
            </Text>
            <Text style={[Typography.FONT_REGULAR, Styles.smallText]}>
              {ameelioCost === 1
                ? i18n.t('Premium.ameelio')
                : i18n.t('Premium.ameelios')}
            </Text>
          </View>
          <View style={Styles.numContainer}>
            <Text style={[Typography.FONT_REGULAR, Styles.smallText]}>
              {i18n.t('Premium.balance')}: {ameelioBalance}{' '}
              {ameelioBalance === 1
                ? i18n.t('Premium.ameelio')
                : i18n.t('Premium.ameelios')}
            </Text>
          </View>
        </View>
      ) : null}
      {plusCost !== undefined && plusBalance !== undefined ? (
        <View style={Styles.currencyContainer}>
          <View style={Styles.numContainer}>
            <Text style={[Typography.FONT_REGULAR, Styles.bigNum]}>
              {plusCost}
            </Text>
            <Text style={[Typography.FONT_REGULAR, Styles.smallText]}>
              {i18n.t('Premium.ameelioPlus')}
            </Text>
          </View>
          <View style={Styles.numContainer}>
            <Text style={[Typography.FONT_REGULAR, Styles.smallText]}>
              {i18n.t('Premium.balance')}: {plusBalance}{' '}
              {i18n.t('Premium.ameelioPlus')}
            </Text>
          </View>
        </View>
      ) : null}
    </View>
  );
};

ReviewCredits.defaultProps = {
  ameelioCost: undefined,
  ameelioBalance: undefined,
  plusCost: undefined,
  plusBalance: undefined,
};

export default ReviewCredits;
