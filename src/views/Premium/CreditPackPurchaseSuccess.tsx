import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import { PremiumPack } from 'types';
import i18n from '@i18n';
import LetterBox from '@assets/views/Issues/LetterBox';
import { Button, Icon } from '@components';
import { Typography } from '@styles';
import Styles from './CreditPackPurchaseSuccess.styles';

type CreditPackPurchaseSuccessNavigationProp = StackNavigationProp<
  AppStackParamList,
  Screens.CreditPackPurchaseSuccess
>;

interface Props {
  navigation: CreditPackPurchaseSuccessNavigationProp;
  route: {
    params: {
      pack: PremiumPack;
    };
  };
}

const CreditPackPurchaseSuccess: React.FC<Props> = ({
  navigation,
  route,
}: Props) => {
  return (
    <View style={Styles.trueBackground}>
      <View style={Styles.contentBackground}>
        <Icon svg={LetterBox} />
        <Text style={[Typography.FONT_BOLD, Styles.title]}>
          {i18n.t('CreditPackPurchaseSuccess.title')}
        </Text>
        <Text style={[Styles.body]}>
          {i18n.t('CreditPackPurchaseSuccess.body')}
        </Text>
      </View>
      <Button
        buttonText={i18n.t('CreditPackPurchaseSuccess.buttonCta')}
        onPress={() => {
          navigation.reset({
            index: 0,
            routes: [
              { name: Screens.ContactSelector },
              { name: Screens.SingleContact },
            ],
          });
        }}
      />
    </View>
  );
};

export default CreditPackPurchaseSuccess;
