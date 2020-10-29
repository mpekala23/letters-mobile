import {
  AmeelioPlusCard,
  Button,
  PremiumSubcategorySelector,
} from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppState } from '@store/types';
import { Colors, Typography } from '@styles';
import { Category } from 'types';
import { AppStackParamList, Screens } from '@utils/Screens';
import React, { useState } from 'react';
import { View, Text, FlatList, Animated } from 'react-native';
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
}

function renderCategory(
  category: Category,
  navigation: StoreScreenNavigationProp
): JSX.Element {
  const designs = Object.values(category.subcategories).flat();

  return (
    <View>
      <Text
        style={[
          Typography.FONT_SEMIBOLD,
          { fontSize: 24, color: Colors.AMEELIO_BLACK, paddingLeft: 16 },
        ]}
      >
        {category.name}
      </Text>
      <FlatList
        horizontal
        data={designs}
        renderItem={({ item }) => {
          return (
            <PremiumSubcategorySelector
              design={item}
              handlePress={() => {
                navigation.navigate(Screens.StoreItem, { item });
              }}
            />
          );
        }}
        keyExtractor={(item) => `${item.id}`}
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
}: Props) => {
  const [scrollPos] = useState(new Animated.Value(136));

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollPos } } }],
    { useNativeDriver: true }
  );

  return (
    <View>
      <Animated.FlatList
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
        onScroll={onScroll}
        data={categories}
        renderItem={({ item }) => renderCategory(item, navigation)}
        keyExtractor={(item) => item.name}
      />
      <Animated.View
        style={[
          {
            transform: [
              {
                translateY: scrollPos.interpolate({
                  inputRange: [0, 1000],
                  outputRange: [136, -1000 + 136],
                }),
              },
            ],
          },
          Styles.animatedScrollContainer,
        ]}
      >
        <Button
          buttonText={i18n.t('Premium.viewHistory')}
          reverse
          onPress={() => {
            navigation.navigate(Screens.TransactionHistory);
          }}
        />
      </Animated.View>
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  coins: state.user.user.coins,
  categories: state.premium.premiumCategories,
});
const StoreScreen = connect(mapStateToProps)(StoreScreenBase);

export default StoreScreen;