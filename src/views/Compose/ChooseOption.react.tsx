import React, { Dispatch } from 'react';
import { Text, ScrollView } from 'react-native';
import { LetterOptionCard } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screens } from '@utils/Screens';
import { MailTypes, Draft } from 'types';
import { Typography } from '@styles';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setComposing } from '@store/Mail/MailActions';
import { MailActionTypes } from '@store/Mail/MailTypes';
import i18n from '@i18n';
import * as Segment from 'expo-analytics-segment';
import Styles from './Compose.styles';

type ChooseOptionsScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ChooseOption'
>;

interface Props {
  navigation: ChooseOptionsScreenNavigationProp;
  recipientId: number;
  setComposing: (draft: Draft) => void;
}

const ChooseOptionScreenBase: React.FC<Props> = (props: Props) => {
  return (
    <ScrollView style={Styles.screenBackground}>
      <Text style={[Typography.FONT_SEMIBOLD, Styles.headerText]}>
        {i18n.t('Compose.chooseAnOption')}
      </Text>
      <LetterOptionCard
        type={MailTypes.Postcard}
        onPress={() => {
          Segment.trackWithProperties('Compose - Click on Compose Option', {
            Option: 'Photo',
          });
          props.setComposing({
            type: MailTypes.Postcard,
            recipientId: props.recipientId,
            content: '',
            design: {
              image: { uri: '' },
            },
          });
          props.navigation.navigate(Screens.ComposePersonal, {
            category: {
              name: 'personal',
              id: -1,
              image: { uri: '' },
              blurb: '',
              subcategories: {},
            },
          });
        }}
      />
      <LetterOptionCard
        type={MailTypes.Letter}
        onPress={() => {
          Segment.trackWithProperties('Compose - Click on Compose Option', {
            Option: 'Letter',
          });
          props.setComposing({
            type: MailTypes.Letter,
            recipientId: props.recipientId,
            content: '',
            images: [],
          });
          props.navigation.navigate(Screens.ComposeLetter);
        }}
      />
    </ScrollView>
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
const ChooseOptionScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseOptionScreenBase);

export default ChooseOptionScreen;
