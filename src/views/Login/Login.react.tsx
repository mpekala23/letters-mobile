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
import { login } from "@api";
import { Button, GrayBar, Input } from "@components";
import { getDropdownRef } from "@components/Dropdown/Dropdown.react";
import { Typography } from "@styles";
import Styles from "./Login.styles";

export interface LoginState {
  remember: boolean;
  inputting: boolean;
}

class LoginScreen extends React.Component<{}, LoginState> {
  constructor(props) {
    super(props);
    this.state = {
      remember: false,
      inputting: false,
    };
    this.emailRef = createRef();
    this.passwordRef = createRef();
    this.dropdownRef = getDropdownRef();
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
                  onPress={() => {
                    Keyboard.dismiss();
                    console.log("login pressed");
                    const cred = {
                      email: this.emailRef.current.state.value,
                      password: this.passwordRef.current.state.value,
                      remember: this.state.remember,
                    };
                    login(cred)
                      .then((data) => {
                        console.log("data received");
                        console.log(data);
                      })
                      .catch((err) => {
                        console.log(err.message);
                        console.log("nope it went wrong");
                        if (err.message === "Incorrect credentials") {
                          Alert.alert("Incorrect username or password");
                        } else {
                          // time out
                          this.dropdownRef.alertWithType(
                            "error",
                            "Network Error",
                            "The request timed out."
                          );
                        }
                      });
                  }}
                />
                <Button
                  containerStyle={Styles.fullWidth}
                  buttonText="Register"
                  reverse
                  onPress={() => {
                    Keyboard.dismiss();
                    console.log("register pressed");
                    this.props.navigation.navigate("Register");
                  }}
                />
                <Button
                  containerStyle={Styles.forgotContainer}
                  textStyle={Styles.forgotText}
                  buttonText="Forgot Your Password?"
                  onPress={() => {
                    Keyboard.dismiss();
                    console.log("forgot pressed");
                  }}
                />
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text style={Typography.FONT_REGULAR}>
                    By creating an account, you agree to the
                  </Text>
                </View>
                <View style={Styles.termsContainer}>
                  <Button link buttonText={"Terms of Service "} />
                  <Text style={Typography.FONT_REGULAR}>and</Text>
                  <Button link buttonText={" Privacy Policy"} />
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
