import { AsyncImage, Button } from '@components';
import { popupAlert } from '@components/Alert/Alert.react';
import i18n from '@i18n';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppState } from '@store/types';
import { Typography } from '@styles';
import { DesignPacket } from 'types';
import { AppStackParamList, Screens } from '@utils/Screens';
import React from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { capitalize } from '@utils';
import PriceTag from '@components/PriceTag/PriceTag.react';
import Styles from './StoreItem.styles';

type StoreItemScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  Screens.StoreItem
>;

interface Props {
  coins: number;
  navigation: StoreItemScreenNavigationProp;
  route: { params: { item: DesignPacket } };
}

const StoreItemBase: React.FC<Props> = ({
  coins,
  route,
  navigation,
}: Props) => {
  const { item } = route.params;

  const initiatePurchase = (): void => {
    if (coins < item.price) {
      popupAlert({
        title: i18n.t('Premium.notEnoughAmeelioPlus'),
        buttons: [
          {
            text: i18n.t('Premium.buyMoreAmeelioPlus'),
            onPress: () => {
              navigation.navigate(Screens.CreditPackStore);
            },
          },
          { text: i18n.t('Premium.noThanks'), reverse: true },
        ],
      });
      return;
    }
    navigation.navigate(Screens.SelectRecipient, { item });
  };
  return (
    <View style={Styles.wrapper}>
      <AsyncImage
        download
        source={item.thumbnail}
        autorotate={false}
        viewStyle={{ width: '100%', height: '30%' }}
      />
      <View style={Styles.container}>
        <View style={Styles.title}>
          <View style={{ flex: 1 }}>
            <Text style={[Typography.FONT_BOLD, { fontSize: 18 }]}>
              {capitalize(item.name)}
            </Text>
          </View>
          <Button
            reverse
            buttonText={i18n.t('StoreItem.viewBtn')}
            onPress={() => {
              navigation.navigate(Screens.StoreItemPreview, {
                uri: item.asset.uri,
              });
            }}
          />
        </View>
        <Text style={[Typography.FONT_BOLD, { fontSize: 16 }]}>
          {i18n.t('StoreItem.description')}
        </Text>
        <Text style={{ marginBottom: 16 }}>{item.blurb}</Text>
        <View style={Styles.line} />
        <PriceTag
          price={item.price}
          containerStyle={{ marginVertical: 8 }}
          iconStyle={{ width: 30, height: 30 }}
          textStyle={{ fontSize: 32 }}
          hasLabel
        />
        <Button
          buttonText={i18n.t('StoreItem.purchaseBtn')}
          onPress={initiatePurchase}
        />
      </View>
    </View>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    contacts: state.contact.existing,
    coins: state.user.user.coins,
  };
};

const StoreItemScreen = connect(mapStateToProps)(StoreItemBase);

export default StoreItemScreen;
