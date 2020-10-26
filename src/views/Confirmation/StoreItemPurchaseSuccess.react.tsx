import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import i18n from '@i18n';
import LetterBox from '@assets/views/Issues/LetterBox';
import { Button, Icon } from '@components';
import { Typography } from '@styles';
import Styles from './Confirmation.styles';

type StoreItemPurchaseSuccessNavigationProp = StackNavigationProp<
  AppStackParamList,
  Screens.CreditPackPurchaseSuccess
>;

interface Props {
  navigation: StoreItemPurchaseSuccessNavigationProp;
}

const StoreItemPurchaseSuccessScreen: React.FC<Props> = ({
  navigation,
}: Props) => {
  return (
    <View style={Styles.trueBackground}>
      <View style={Styles.contentBackground}>
        <Icon svg={LetterBox} />
        <Text style={[Typography.FONT_BOLD, Styles.title]}>
          {i18n.t('StoreItemPurchaseSuccess.title')}
        </Text>
        <Text style={[Styles.body]}>
          {i18n.t('StoreItemPurchaseSuccess.body')}
        </Text>
      </View>
      <Button
        buttonText={i18n.t('StoreItemPurchaseSuccess.buttonCta')}
        onPress={() => {
          // TODO: redirect to Mark's transaction history page
          navigation.reset({
            index: 0,
            routes: [{ name: Screens.Store }],
          });
        }}
      />
    </View>
  );
};

export default StoreItemPurchaseSuccessScreen;
