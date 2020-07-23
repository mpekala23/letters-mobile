import React, { Dispatch } from 'react';
import { Text, View } from 'react-native';
import { LetterOptionCard } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { LetterTypes } from 'types';
import { Colors, Typography } from '@styles';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setType, setRecipientId } from '@store/Letter/LetterActions';
import { LetterState, LetterActionTypes } from '@store/Letter/LetterTypes';
import { UserState } from '@store/User/UserTypes';
import { STATE_TO_ABBREV } from '@utils';
import i18n from '@i18n';
import Styles from './Compose.styles';

type ChooseOptionsScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Home'
>;

interface Props {
  navigation: ChooseOptionsScreenNavigationProp;
  letterState: LetterState;
  userState: UserState;
  recipientId: number;
  setType: (type: LetterTypes) => void;
  setRecipientId: (id: number) => void;
}

const ChooseOptionScreenBase: React.FC<Props> = (props: Props) => {
  const { user } = props.userState;
  return (
    <View style={Styles.screenBackground}>
      <Text style={[Typography.FONT_BOLD, Styles.headerText]}>
        {i18n.t('Compose.chooseAnOption')}
      </Text>
      <Text
        style={[
          Typography.FONT_REGULAR,
          { fontSize: 14, color: Colors.GRAY_DARK, paddingBottom: 10 },
        ]}
      >
        {i18n.t('Compose.psYourLovedOneWillRespondTo')} {user.address1}
        {user.address2 ? ` ${user.address2}` : ''}, {user.city},{' '}
        {STATE_TO_ABBREV[user.state]} {user.postal}.
      </Text>
      <LetterOptionCard
        type={LetterTypes.Postcard}
        onPress={() => {
          props.setType(LetterTypes.Postcard);
          props.setRecipientId(props.recipientId);
          props.navigation.navigate('ComposePostcard');
        }}
      />
      <LetterOptionCard
        type={LetterTypes.Letter}
        onPress={() => {
          props.setType(LetterTypes.Letter);
          props.setRecipientId(props.recipientId);
          props.navigation.navigate('ComposeLetter');
        }}
      />
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  letterState: state.letter,
  userState: state.user,
  recipientId: state.contact.active.id,
});
const mapDispatchToProps = (dispatch: Dispatch<LetterActionTypes>) => {
  return {
    setType: (type: LetterTypes) => dispatch(setType(type)),
    setRecipientId: (id: number) => dispatch(setRecipientId(id)),
  };
};
const ChooseOptionScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseOptionScreenBase);

export default ChooseOptionScreen;
