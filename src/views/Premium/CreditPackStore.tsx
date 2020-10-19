import i18n from '@i18n';
import React, { useState, useEffect } from 'react';
import { View, Text, ImageComponent } from 'react-native';
import { AppState } from '@store/types';
import { connect } from 'react-redux';
import { EntityTypes, PremiumPack } from 'types';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { getPremiumPacks } from '@api/Premium';
import Loading from '@assets/common/loading.gif';
import { AsyncImage, Button, Icon } from '@components';
import { Typography } from '@styles';
import * as Segment from 'expo-analytics-segment';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import GoldenBirdCoin from '@assets/views/Premium/GoldenBirdCoin';
import { checkIfLoading } from '@store/selectors';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import PremiumPackStorePlaceholder from '@components/Loaders/PremiumPackStorePlaceholder';
import Styles from './CreditPackStore.styles';

type CreditPackStoreScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  Screens.CreditPackCheckoutWebView
>;

interface Props {
  navigation: CreditPackStoreScreenNavigationProp;
  packs: PremiumPack[];
  isLoadingPremiumPacks: boolean;
}

const CreditPackStoreBase = ({
  packs,
  navigation,
  isLoadingPremiumPacks,
}: Props) => {
  const [selected, setSelected] = useState<PremiumPack>();

  const FAMILY_MONTHLY_COST = 1.65;
  const PROFIT_COIN = 0.053;

  useEffect(() => {
    async function fetchPremiumPacks() {
      try {
        await getPremiumPacks();
      } catch (err) {
        dropdownError({ message: i18n.t('Error.cantLoadPremiumPacks') });
      }
    }
    if (!isLoadingPremiumPacks) {
      fetchPremiumPacks();
    }
  }, []);

  const calculateFamiliesHelped = (totalCoins: number): number => {
    return Math.round((totalCoins * PROFIT_COIN) / FAMILY_MONTHLY_COST);
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: PremiumPack;
    index: number;
  }) => {
    const borderStyle =
      selected?.id === item.id
        ? Styles.cardSelectedBackground
        : Styles.cardRegularBackground;
    return (
      <TouchableOpacity
        style={[Styles.cardBase, borderStyle]}
        key={item.id + index.toString()}
        onPress={() => setSelected(item)}
      >
        <AsyncImage
          download
          source={{ uri: item.image.uri }}
          viewStyle={{
            height: item.image.height || 74,
            width: item.image.width || 74,
          }}
          accessibilityLabel="Credit Pack Image"
          autorotate={false}
        />
        <View style={{ marginLeft: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon
              svg={GoldenBirdCoin}
              style={{ marginRight: 8, height: 16, width: 16 }}
            />
            <Text style={[Typography.FONT_BOLD, Styles.cardTitle]}>
              {item.name}
            </Text>
          </View>
          <Text style={Styles.cardBodyText}>${item.price / 100}</Text>
          <Text style={Styles.cardBodyText}>
            {calculateFamiliesHelped(item.coins)} families helped
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={Styles.trueBackground}>
      <Text style={[Styles.title, Typography.FONT_BOLD]}>
        {i18n.t('CreditPackStore.title')}
      </Text>
      <Text style={Styles.subtitle}>{i18n.t('CreditPackStore.subtitle')}</Text>
      {isLoadingPremiumPacks ? (
        <PremiumPackStorePlaceholder />
      ) : (
        <FlatList
          data={packs}
          contentContainerStyle={{ marginVertical: 16 }}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id.toString() + index.toString()}
          ListEmptyComponent={() => {
            return (
              <ImageComponent
                source={Loading}
                style={{
                  width: 50,
                  height: 50,
                }}
              />
            );
          }}
        />
      )}
      <Button
        containerStyle={{ marginVertical: 16 }}
        enabled={!!selected}
        buttonText={i18n.t('CreditPackStore.selectBtn')}
        onPress={() => {
          if (selected) {
            Segment.track('Premium Pack Store - Click on Confirm Pack');
            navigation.navigate(Screens.CreditPackCheckoutWebView, {
              pack: selected,
            });
          }
        }}
      />
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  packs: state.premium.premiumPacks,
  isLoadingPremiumPacks: checkIfLoading(state, EntityTypes.PremiumPacks),
});

const CreditPackStoreScreen = connect(mapStateToProps)(CreditPackStoreBase);

export default CreditPackStoreScreen;
