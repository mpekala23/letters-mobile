import React, { Dispatch } from 'react';
import { Text, View } from 'react-native';
import { LetterOptionCard } from '@components';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '@navigations';
import { LetterTypes } from 'types';
import { Typography } from '@styles';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { setType } from '@store/Letter/LetterActions';
import { LetterState, LetterActionTypes } from '@store/Letter/LetterTypes';
import Styles from './Compose.styles';

type ChooseOptionsScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'Home'
>;

interface Props {
  navigation: ChooseOptionsScreenNavigationProp;
  letterState: LetterState;
  setType: (type: LetterTypes) => void;
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
          props.navigation.navigate('ComposePostcard');
        }}
      />
      <LetterOptionCard
        type={LetterTypes.Letter}
        onPress={() => {
          props.setType(LetterTypes.Letter);
          props.navigation.navigate('ComposeLetter');
        }}
      />
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  letterState: state.letter,
});
const mapDispatchToProps = (dispatch: Dispatch<LetterActionTypes>) => {
  return {
    setType: (type: LetterTypes) => dispatch(setType(type)),
  };
};
const ChooseOptionScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseOptionScreenBase);

export default ChooseOptionScreen;
