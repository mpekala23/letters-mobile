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
import { getDropdownRef } from "@components/Dropdown/Dropdown.react";
import DropdownAlert from "react-native-dropdownalert";
import { Typography } from "@styles";
import Styles from "./Login.styles";
import { UserCredentials } from "@store/User/UserTypes";

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
  private dropdownRef = createRef<DropdownAlert>();

  constructor(props: Props) {
    super(props);
    this.state = {
      remember: false,
      inputting: false,
      loggedIn: false,
    };
    this.emailRef = createRef();
    this.passwordRef = createRef();
    this.dropdownRef = getDropdownRef();
  }

  onLogin = async () => {
    Keyboard.dismiss();
    if (this.emailRef.current && this.passwordRef.current) {
      const cred: UserCredentials = {
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
          Alert.alert("Incorrect username or password");
        } else if (err.message === "timeout") {
          if (this.dropdownRef.current)
            this.dropdownRef.current.alertWithType(
              "error",
              "Network Error",
              "The request timed out."
            );
        } else {
          if (this.dropdownRef.current)
            this.dropdownRef.current.alertWithType(
              "error",
              "Network Error",
              "The request could not be completed."
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
              <View style={Styles.loginBackground}>
                <Input
                  ref={this.emailRef}
                  parentStyle={Styles.fullWidth}
                  placeholder={"E-Mail Address"}
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                />
                <Input
                  ref={this.passwordRef}
                  parentStyle={Styles.fullWidth}
                  placeholder={"Password"}
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
                  title="Remember Me"
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
                  buttonText="Login"
                  onPress={this.onLogin}
                />
                <Button
                  containerStyle={Styles.fullWidth}
                  buttonText="Register"
                  reverse
                  onPress={() => {
                    Keyboard.dismiss();
                    this.props.navigation.navigate("Register");
                  }}
                />
                <Button
                  containerStyle={Styles.forgotContainer}
                  textStyle={Styles.forgotText}
                  buttonText="Forgot Your Password?"
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
                    By creating an account, you agree to the
                  </Text>
                </View>
                <View style={Styles.termsContainer}>
                  <Button
                    link
                    buttonText={"Terms of Service "}
                    onPress={() => {}}
                  />
                  <Text accessible={false} style={Typography.FONT_REGULAR}>and</Text>
                  <Button
                    link
                    buttonText={" Privacy Policy"}
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
