import React, { createRef } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "@navigations";
import { login } from "@api";
import { Button, GrayBar, Input } from "@components";
import { dropdownError } from "@components/Dropdown/Dropdown.react";
import DropdownAlert from "react-native-dropdownalert";
import { Typography } from "@styles";
import Styles from "./Login.styles";
import { UserLoginInfo } from "@store/User/UserTypes";
import { i18n } from "@i18n";

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export interface Props {
  navigation: LoginScreenNavigationProp;
}

export interface State {
  remember: boolean;
  inputting: boolean;
  loggedIn: boolean;
}

class LoginScreen extends React.Component<Props, State> {
  private emailRef = createRef<Input>();
  private passwordRef = createRef<Input>();

  constructor(props: Props) {
    super(props);
    this.state = {
      remember: false,
      inputting: false,
      loggedIn: false,
    };
    this.emailRef = createRef();
    this.passwordRef = createRef();
  }

  devSkip = async () => {
    if (this.emailRef.current) this.emailRef.current.set("team@ameelio.org");
    if (this.passwordRef.current) this.passwordRef.current.set("password");
    setTimeout(() => {
      this.onLogin();
    }, 10);
  };

  onLogin = async () => {
    Keyboard.dismiss();
    if (this.emailRef.current && this.passwordRef.current) {
      const cred: UserLoginInfo = {
        email: this.emailRef.current && this.emailRef.current.state.value,
        password:
          this.passwordRef.current && this.passwordRef.current.state.value,
        remember: this.state.remember,
      };
      try {
        const data = await login(cred);
        this.setState({ loggedIn: true });
      } catch (err) {
        if (err.message === "Incorrect credentials") {
          Alert.alert(i18n.t("LoginScreen.incorrectUsernameOrPassword"));
        } else if (err.message === "timeout") {
          dropdownError(i18n.t("Error.network"), i18n.t("Error.timedOut"));
        } else {
          dropdownError(
            i18n.t("Error.network"),
            i18n.t("Error.requestIncomplete")
          );
        }
        this.setState({ loggedIn: false });
      }
    }
  };

  render() {
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
              <View style={Styles.loginBackground}>
                <Button onPress={this.devSkip} buttonText="Dev Skip" />
                <Input
                  ref={this.emailRef}
                  parentStyle={Styles.fullWidth}
                  placeholder={i18n.t("LoginScreen.emailAddress")}
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  nextInput={this.passwordRef}
                />
                <Input
                  ref={this.passwordRef}
                  parentStyle={Styles.fullWidth}
                  placeholder={i18n.t("LoginScreen.password")}
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  secure={true}
                />
                <CheckBox
                  checkedIcon={<Text>X</Text>}
                  uncheckedIcon={<Text>O</Text>}
                  center
                  title={i18n.t("LoginScreen.rememberMe")}
                  containerStyle={{
                    backgroundColor: "white",
                    width: "50%",
                    borderWidth: 0,
                  }}
                  checked={this.state.remember}
                  onPress={() => {
                    this.setState({ remember: !this.state.remember });
                  }}
                />
                <GrayBar />
                <Button
                  containerStyle={Styles.fullWidth}
                  buttonText={i18n.t("LoginScreen.login")}
                  onPress={this.onLogin}
                />
                <Button
                  containerStyle={Styles.fullWidth}
                  buttonText={i18n.t("LoginScreen.register")}
                  reverse
                  onPress={() => {
                    Keyboard.dismiss();
                    this.props.navigation.navigate("Register");
                  }}
                />
                <Button
                  containerStyle={Styles.forgotContainer}
                  textStyle={Styles.forgotText}
                  buttonText={i18n.t("LoginScreen.forgotYourPassword")}
                  onPress={() => {
                    Keyboard.dismiss();
                  }}
                />
                <View
                  accessible
                  accessibilityLabel="By creating an account, you agree to the terms of service and privacy policy."
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text style={Typography.FONT_REGULAR}>
                    {i18n.t("LoginScreen.termsCondition")}
                  </Text>
                </View>
                <View style={Styles.termsContainer}>
                  <Button
                    link
                    buttonText={i18n.t("LoginScreen.termsOfService")}
                    onPress={() => {}}
                  />
                  <Text accessible={false} style={Typography.FONT_REGULAR}>
                    {i18n.t("LoginScreen.termsConditionAnd")}
                  </Text>
                  <Button
                    link
                    buttonText={i18n.t("LoginScreen.privacyPolicy")}
                    onPress={() => {}}
                  />
                  <Text style={Typography.FONT_REGULAR}>.</Text>
                </View>
                <View style={{ width: "100%", height: 100 }} />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  }
}

export default LoginScreen;
