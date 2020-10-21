import {
  AdjustableText,
  AmeelioPlusCard,
  AsyncImage,
  Button,
  Icon,
} from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppState } from '@store/types';
import { Colors, Typography } from '@styles';
import { Category } from 'types';
import { AppStackParamList, Screens } from '@utils/Screens';
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import { capitalize } from '@utils';
import i18n from '@i18n';
import GoldBird from '@assets/common/GoldBird';
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

function renderSubcategory(
  subcategoryName: string,
  subcategoryLength: number
): JSX.Element {
  return (
    <TouchableOpacity style={{ width: 142, height: 180 }}>
      <View
        style={[
          Styles.shadowBox,
          {
            elevation: 6,
            backgroundColor: 'white',
            top: 8,
            left: 8,
            overflow: 'hidden',
          },
        ]}
      >
        <AsyncImage
          download
          source={{
            uri:
              'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/HarvardUniversity_WidenerLibrary_Reading_c1915_cropped.jpg/330px-HarvardUniversity_WidenerLibrary_Reading_c1915_cropped.jpg',
          }}
          viewStyle={{ height: 84 }}
        />
        <View style={{ padding: 8, flex: 1 }}>
          <AdjustableText
            numberOfLines={1}
            style={[Typography.FONT_BOLD, { fontSize: 14 }]}
          >
            {capitalize(subcategoryName)}
          </AdjustableText>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <AdjustableText
              numberOfLines={1}
              style={[
                Typography.FONT_REGULAR,
                { fontSize: 14, color: Colors.GRAY_400, flex: 1 },
              ]}
            >
              {subcategoryLength}{' '}
              {subcategoryLength === 1
                ? i18n.t('Premium.page')
                : i18n.t('Premium.pages')}
            </AdjustableText>
            <AdjustableText
              numberOfLines={1}
              style={[
                Typography.FONT_REGULAR,
                { fontSize: 14, color: Colors.GRAY_400 },
              ]}
            >
              30
            </AdjustableText>
            <View style={{ width: 16, height: 16 }}>
              <Icon svg={GoldBird} />
            </View>
          </View>
        </View>
      </View>
      <View
        style={[
          Styles.shadowBox,
          { elevation: 5, backgroundColor: Colors.GRAY_100, top: 12, left: 12 },
        ]}
      />
      <View
        style={[
          Styles.shadowBox,
          { elevation: 4, backgroundColor: Colors.GRAY_200, top: 16, left: 16 },
        ]}
      />
    </TouchableOpacity>
  );
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
          return renderSubcategory(item, category.subcategories[item].length);
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
}: Props) => {
  return (
    <ScrollView style={Styles.trueBackground}>
      <View style={{ marginHorizontal: 16 }}>
        <AmeelioPlusCard
          tokensLeft={coins}
          onPress={() => {
            navigation.navigate(Screens.CreditPackStore);
          }}
        />
      </View>
      <View style={{ paddingTop: 16 }}>
        <FlatList
          data={categories}
          renderItem={({ item }) => renderCategory(item)}
          keyExtractor={(item) => item.name}
        />
        <Button
          buttonText={i18n.t('Premium.viewHistory')}
          containerStyle={{
            position: 'absolute',
            right: 16,
            borderWidth: 0,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,
            elevation: 2,
          }}
          reverse
          onPress={() => {
            /* do nothing */
          }}
        />
      </View>
    </ScrollView>
  );
};

const mapStateToProps = (state: AppState) => ({
  coins: state.user.user.coins,
  categories: state.premium.premiumCategories,
});
const StoreScreen = connect(mapStateToProps)(StoreScreenBase);

export default StoreScreen;
