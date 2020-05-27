import React, { useState } from "react";
import {
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
import { Typography } from "@styles";
import Styles from "./Login.styles";

const LoginScreen: React.FC = (props) => {
  const [remember, setRemember] = useState(false);
  const [inputting, setInputting] = useState(false);
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
            scrollEnabled={inputting}
          >
            <View style={{ width: "100%", height: 60 }} />
            <View style={Styles.loginBackground}>
              <Input
                parentStyle={Styles.fullWidth}
                placeholder={"E-Mail Address"}
                onFocus={() => {
                  setInputting(true);
                }}
                onBlur={() => {
                  setInputting(false);
                }}
              />
              <Input
                parentStyle={Styles.fullWidth}
                placeholder={"Password"}
                onFocus={() => {
                  setInputting(true);
                }}
                onBlur={() => {
                  setInputting(false);
                }}
              />
              <CheckBox
                center
                title="Remember Me"
                containerStyle={{
                  backgroundColor: "white",
                  width: "50%",
                  borderWidth: 0,
                }}
                onPress={() => {
                  setRemember(!remember);
                }}
                checked={remember}
              />
              <GrayBar />
              <Button
                containerStyle={Styles.fullWidth}
                buttonText="Login"
                onPress={() => {
                  Keyboard.dismiss();
                  console.log("login pressed");
                  login()
                    .then((data) => {
                      console.log("data received");
                      console.log(data);
                    })
                    .catch((err) => {
                      console.log("nope it went wrong");
                      console.log(err.message);
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
              <View style={{ flexDirection: "row", justifyContent: "center" }}>
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
};

export default LoginScreen;
