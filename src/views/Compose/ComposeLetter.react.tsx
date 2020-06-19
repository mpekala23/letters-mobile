import React, { Dispatch, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { ComposeHeader, Input } from "@components";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "@navigations";
import Styles from "./Compose.styles";
import { connect } from "react-redux";
import { AppState } from "@store/types";
import { setMessage } from "@store/Letter/LetterActions";
import { LetterState, LetterActionTypes } from "@store/Letter/LetterTypes";

type ComposeLetterScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  "Home"
>;

interface Props {
  navigation: ComposeLetterScreenNavigationProp;
  letterState: LetterState;
  setMessage: (message: string) => void;
}

const ComposeLetterScreenBase: React.FC<Props> = (props: Props) => {
  const [inputting, setInputting] = useState(false);

  return (
    <TouchableOpacity
      accessible={false}
      style={{ flex: 1, backgroundColor: "white" }}
      onPress={Keyboard.dismiss}
      activeOpacity={1.0}
    >
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          scrollEnabled={inputting}
        >
          <View style={[Styles.screenBackground, { backgroundColor: "white" }]}>
            <ComposeHeader recipientName="Mark" />
            <Input
              onFocus={() => {
                setInputting(true);
              }}
              onBlur={() => {
                setInputting(false);
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableOpacity>
  );
};

const mapStateToProps = (state: AppState) => ({
  letterState: state.letter,
});
const mapDispatchToProps = (dispatch: Dispatch<LetterActionTypes>) => {
  return {
    setMessage: (message: string) => dispatch(setMessage(message)),
  };
};
const ComposeLetterScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ComposeLetterScreenBase);

export default ComposeLetterScreen;
