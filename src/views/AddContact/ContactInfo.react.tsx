import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Typography } from "@styles";
import Styles from "./ContactInfo.styles";

export interface Props {
  navigation: LoginScreenNavigationProp;
}

export interface State {
  inputting: boolean;
}

class ContactInfoScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      inputting: true,
    };
  }

  render() {
    return (
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: "white" }}
        onPress={() => Keyboard.dismiss()}
        activeOpacity={1.0}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
          behavior="padding"
          enabled
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              scrollEnabled={this.state.inputting}
            >
              <View style={{ width: "100%", height: 60 }} />
              <View style={{ width: "100%", height: 100 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  }
}

export default ContactInfoScreen;
