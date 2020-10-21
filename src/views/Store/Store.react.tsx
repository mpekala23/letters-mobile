import {
  AmeelioPlusCard,
  Button,
  PremiumSubcategorySelector,
} from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppState } from '@store/types';
import { Colors, Typography } from '@styles';
import { Category, PremiumPack } from 'types';
import { AppStackParamList, Screens } from '@utils/Screens';
import React from 'react';
import { View, Text, ScrollView, FlatList } from 'react-native';
import { connect } from 'react-redux';
import i18n from '@i18n';
import Styles from './Store.styles';

type StoreScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  Screens.Store
>;

interface Props {
  navigation: StoreScreenNavigationProp;
  coins: number;
  categories: Category[];
  packs: PremiumPack[];
}

function renderCategory(category: Category): JSX.Element {
  const subcategoryNames = Object.keys(category.subcategories);

  return (
    <View>
      <Text
        style={[
          Typography.FONT_BOLD,
          { fontSize: 24, color: Colors.AMEELIO_BLACK, paddingLeft: 16 },
        ]}
      >
        {category.name}
      </Text>
      <FlatList
        horizontal
        data={subcategoryNames}
        renderItem={({ item }) => {
          return (
            <PremiumSubcategorySelector
              subcategoryName={item}
              subcategoryLength={category.subcategories[item].length}
            />
          );
        }}
        keyExtractor={(item) => item}
        ListHeaderComponent={<View style={{ width: 16 }} />}
        ListFooterComponent={<View style={{ width: 16 }} />}
      />
    </View>
  );
}

const StoreScreenBase: React.FC<Props> = ({
  navigation,
  coins,
  categories,
  packs,
}: Props) => {
  return (
    <View>
      <FlatList
        ListHeaderComponent={() => {
          return (
            <View style={{ marginHorizontal: 16, paddingBottom: 16 }}>
              <AmeelioPlusCard
                tokensLeft={coins}
                onPress={() => {
                  navigation.navigate(Screens.CreditPackStore);
                }}
              />
            </View>
          );
        }}
        data={categories}
        renderItem={({ item }) => renderCategory(item)}
        keyExtractor={(item) => item.name}
      />
      <Button
        buttonText={i18n.t('Premium.viewHistory')}
        containerStyle={Styles.viewHistoryButton}
        reverse
        onPress={() => {
          /* do nothing */
        }}
      />
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  coins: state.user.user.coins,
  categories: state.premium.premiumCategories,
  packs: state.premium.premiumPacks,
});
const StoreScreen = connect(mapStateToProps)(StoreScreenBase);

export default StoreScreen;
