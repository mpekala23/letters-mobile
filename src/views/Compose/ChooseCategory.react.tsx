import React, { Dispatch } from 'react';
import { Text, View } from 'react-native';
import { CategoryCard } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { Draft, Category } from 'types';
import { Typography } from '@styles';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setComposing } from '@store/Mail/MailActions';
import { MailActionTypes } from '@store/Mail/MailTypes';
import i18n from '@i18n';
import { getCategories } from '@api';
import { FlatList } from 'react-native-gesture-handler';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import Styles from './Compose.styles';

type ChooseCategoryScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ChooseCategory'
>;

interface Props {
  navigation: ChooseCategoryScreenNavigationProp;
  recipientId: number;
  setComposing: (draft: Draft) => void;
}

interface State {
  categories: Category[];
  refreshing: boolean;
}

class ChooseCategoryScreenBase extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      categories: [],
      refreshing: true,
    };
    this.renderCategory = this.renderCategory.bind(this);
    this.refreshCategories = this.refreshCategories.bind(this);
  }

  async componentDidMount() {
    await this.refreshCategories();
  }

  async refreshCategories() {
    this.setState({ refreshing: true }, async () => {
      try {
        const categories = await getCategories();
        this.setState({
          categories,
          refreshing: false,
        });
      } catch (err) {
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
    return (
      <View style={[Styles.screenBackground, { paddingBottom: 0 }]}>
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
          data={this.state.categories.slice(1)}
          ListHeaderComponent={
            this.state.categories.length > 0 ? (
              <CategoryCard
                category={this.state.categories[0]}
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
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  recipientId: state.contact.active.id,
});
const mapDispatchToProps = (dispatch: Dispatch<MailActionTypes>) => {
  return {
    setComposing: (draft: Draft) => dispatch(setComposing(draft)),
  };
};
const ChooseCategoryScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseCategoryScreenBase);

export default ChooseCategoryScreen;
