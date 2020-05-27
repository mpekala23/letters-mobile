import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { CheckBox } from "react-native-elements";
import { login } from "@api";
import { Button, GrayBar, Input } from "@components";
import { Typography } from "@styles";
import Styles from "./Login.styles";
import { TouchableOpacity } from "react-native-gesture-handler";

const LoginScreen: React.FC = (props) => {
  const [remember, setRemember] = useState(false);
  return (
    <View style={Styles.loginBackground}>
      <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={Styles.avoidingBackground}
        >
          <Input
            parentStyle={Styles.fullWidth}
            placeholder={"E-Mail Address"}
          />
          <Input parentStyle={Styles.fullWidth} placeholder={"Password"} />
          <CheckBox
            center
            title="Remember Me"
            containerStyle={{
              backgroundColor: "white",
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
              console.log("register pressed");
            }}
          />
          <Button
            containerStyle={Styles.forgotContainer}
            textStyle={Styles.forgotText}
            buttonText="Forgot Your Password?"
            onPress={() => {
              console.log("forgot pressed");
            }}
          />
          <Text style={Typography.FONT_REGULAR}>
            By creating an account, you agree to the
          </Text>
          <View style={Styles.termsContainer}>
            <Button link buttonText={"Terms of Service "} />
            <Text style={Typography.FONT_REGULAR}>and</Text>
            <Button link buttonText={" Privacy Policy"} />
            <Text style={Typography.FONT_REGULAR}>.</Text>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;
