import React from 'react';
import { Text, View, Image as ImageComponent, Linking } from 'react-native';
import { Button, CategoryCard } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import { Category, EntityTypes } from 'types';
import { Typography } from '@styles';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import i18n from '@i18n';
import { getCategories } from '@api';
import { FlatList } from 'react-native-gesture-handler';
import {
  dropdownError,
  dropdownWarning,
} from '@components/Dropdown/Dropdown.react';
import Loading from '@assets/common/loading.gif';
import * as Sentry from 'sentry-expo';
import { checkIfLoading } from '@store/selectors';
import CategoriesPlaceholder from '@components/Loaders/CategoriesPlaceholder';
import Styles from './Compose.styles';

type ChooseCategoryScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ChooseCategory'
>;

interface Props {
  navigation: ChooseCategoryScreenNavigationProp;
  recipientId: number;
  categories: Category[];
  isTexas: boolean;
  isLoadingCategories: boolean;
}

interface State {
  refreshing: boolean;
}

class ChooseCategoryScreenBase extends React.Component<Props, State> {
  private unsubscribeFocus: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      refreshing: true,
    };
    this.renderCategory = this.renderCategory.bind(this);
    this.refreshCategories = this.refreshCategories.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);

    this.unsubscribeFocus = this.props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
  }

  componentDidMount() {
    if (this.props.categories.length === 0 && !this.props.isLoadingCategories) {
      this.refreshCategories();
    }
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
  }

  onNavigationFocus() {
    if (this.props.isTexas)
      dropdownWarning({
        message: (
          <Text>
            <Text style={Typography.FONT_MEDIUM}>
              {i18n.t('Compose.dueToTDCJ')}
            </Text>
            <Text style={Typography.FONT_BOLD}> Personal </Text>
            <Text style={Typography.FONT_MEDIUM}>
              {i18n.t('Compose.willBeAccepted')}
            </Text>
          </Text>
        ),
        persist: true,
      });
    if (this.props.categories.length === 0) {
      Sentry.captureMessage(
        'Choose category reached without loaded categories'
      );
      this.refreshCategories();
    }
  }

  async refreshCategories() {
    this.setState({ refreshing: true }, async () => {
      try {
        await getCategories();
        this.setState({
          refreshing: false,
        });
      } catch (err) {
        Sentry.captureException(err);
        dropdownError({ message: i18n.t('Error.cantRefreshCategories') });
      }
    });
  }

  renderCategory(category: Category) {
    return (
      <CategoryCard
        category={category}
        navigate={
          this.props.navigation.navigate as (
            val: string,
            params?: Record<string, unknown>
          ) => void
        }
      />
    );
  }

  render() {
    if (this.props.isLoadingCategories) {
      return <CategoriesPlaceholder />;
    }
    return (
      <View style={[Styles.screenBackground, { paddingBottom: 0 }]}>
        {this.props.categories.length ? (
          <>
            <Text
              style={[
                Typography.FONT_SEMIBOLD,
                Styles.headerText,
                { fontSize: 18, paddingBottom: 8 },
              ]}
            >
              {i18n.t('Compose.iWouldLikeToSend')}
            </Text>
            <FlatList
              style={{ flex: 1 }}
              data={this.props.categories.slice(1)}
              ListHeaderComponent={
                this.props.categories.length ? (
                  <CategoryCard
                    category={this.props.categories[0]}
                    navigate={
                      this.props.navigation.navigate as (
                        val: string,
                        params?: Record<string, unknown>
                      ) => void
                    }
                  />
                ) : (
                  <View />
                )
              }
              renderItem={({ item }) => this.renderCategory(item)}
              keyExtractor={(item: Category) => item.id.toString()}
              numColumns={2}
              refreshing={this.state.refreshing}
              onRefresh={this.refreshCategories}
            />
          </>
        ) : (
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
          >
            <ImageComponent
              source={Loading}
              style={{
                width: 40,
                height: 40,
                marginBottom: 8,
              }}
            />
            <Text
              style={[
                Typography.FONT_REGULAR,
                { marginVertical: 32, fontSize: 18, textAlign: 'center' },
              ]}
            >
              {i18n.t('Compose.havingTroubleWithCategories')}
            </Text>
            <Button
              buttonText={i18n.t('Compose.sendPersonalLettersOrPhotos')}
              containerStyle={{ width: '100%' }}
              onPress={() => {
                this.props.navigation.navigate(Screens.ChooseOption);
              }}
            />
            <Button
              buttonText={i18n.t('Compose.reachOutToSupport')}
              containerStyle={{ width: '100%' }}
              reverse
              onPress={async () => {
                await Linking.openURL('https://m.me/teamameelio');
              }}
            />
          </View>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  recipientId: state.contact.active.id,
  isTexas: state.contact.active.facility.state === 'Texas',
  categories: state.category.categories,
  isLoadingCategories: checkIfLoading(state, EntityTypes.Categories),
});
const ChooseCategoryScreen = connect(mapStateToProps)(ChooseCategoryScreenBase);

export default ChooseCategoryScreen;
