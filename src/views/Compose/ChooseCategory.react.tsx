import React, { Dispatch } from 'react';
import { Text, View } from 'react-native';
import { CategoryCard } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { Draft } from 'types';
import { Typography } from '@styles';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setComposing } from '@store/Mail/MailActions';
import { MailActionTypes } from '@store/Mail/MailTypes';
import i18n from '@i18n';
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

const EXAMPLE_CATEGORY = {
  id: 1,
  name: 'personal',
  image: {
    uri:
      'https://s3.amazonaws.com/thumbnails.thecrimson.com/photos/2020/05/26/142110_1344640.jpg.1500x1000_q95_crop-smart_upscale.jpg',
  },
};

const ChooseCategoryScreenBase: React.FC<Props> = (props: Props) => {
  return (
    <View style={Styles.screenBackground}>
      <Text
        style={[
          Typography.FONT_BOLD,
          Styles.headerText,
          { fontSize: 18, paddingBottom: 8 },
        ]}
      >
        {i18n.t('Compose.iWouldLikeToSend')}
      </Text>
      <CategoryCard category={EXAMPLE_CATEGORY} />
    </View>
  );
};

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
