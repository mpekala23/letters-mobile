import React, { Dispatch } from 'react';
import { Text, View } from 'react-native';
import { LetterOptionCard } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { LetterTypes } from 'types';
import { Typography } from '@styles';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setType, setRecipientId } from '@store/Letter/LetterActions';
import { LetterState, LetterActionTypes } from '@store/Letter/LetterTypes';
import Styles from './Compose.styles';

type ChooseOptionsScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Home'
>;

interface Props {
  navigation: ChooseOptionsScreenNavigationProp;
  letterState: LetterState;
  recipientId: number;
  setType: (type: LetterTypes) => void;
  setRecipientId: (id: number) => void;
}

const ChooseOptionScreenBase: React.FC<Props> = (props: Props) => {
  return (
    <View style={Styles.screenBackground}>
      <Text style={[Typography.FONT_BOLD, Styles.headerText]}>
        Choose an option
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
