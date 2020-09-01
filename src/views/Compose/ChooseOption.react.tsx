import React, { Dispatch } from 'react';
import { Text, View } from 'react-native';
import { LetterOptionCard } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList, Screen } from '@navigations';
import { MailTypes, Draft } from 'types';
import { Colors, Typography } from '@styles';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setComposing } from '@store/Mail/MailActions';
import { MailActionTypes } from '@store/Mail/MailTypes';
import { STATE_TO_ABBREV } from '@utils';
import i18n from '@i18n';
import { User } from '@store/User/UserTypes';
import * as Segment from 'expo-analytics-segment';
import Styles from './Compose.styles';

type ChooseOptionsScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ChooseOption'
>;

interface Props {
  navigation: ChooseOptionsScreenNavigationProp;
  user: User;
  recipientId: number;
  setComposing: (draft: Draft) => void;
}

const ChooseOptionScreenBase: React.FC<Props> = (props: Props) => {
  const { user } = props;
  return (
    <View style={Styles.screenBackground}>
      <Text style={[Typography.FONT_SEMIBOLD, Styles.headerText]}>
        {i18n.t('Compose.chooseAnOption')}
      </Text>
      <Text
        style={[
          Typography.FONT_REGULAR,
          { fontSize: 14, color: Colors.GRAY_500, paddingBottom: 10 },
        ]}
      >
        {i18n.t('Compose.psYourLovedOneWillRespondTo')} {user.address1}
        {user.address2 ? ` ${user.address2}` : ''}, {user.city},{' '}
        {STATE_TO_ABBREV[user.state]} {user.postal}.
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
          props.navigation.navigate(Screen.ComposePostcard, {
            category: {
              name: 'personal',
              id: -1,
              image: { uri: '' },
              blurb: '',
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
          });
          props.navigation.navigate(Screen.ComposeLetter);
        }}
      />
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  user: state.user.user,
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
