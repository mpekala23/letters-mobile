import React from "react";
import { KeyboardAvoidingView, ScrollView, View } from "react-native";
import { login } from "@api";
import { Button, Input } from "@components";
import Styles from "./Login.styles";

const LoginScreen: React.FC = (props) => {
  return (
    <View style={Styles.loginBackground}>
      <ScrollView keyboardShouldPersistTaps="handled" scrollEnabled={false}>
        <KeyboardAvoidingView>
          <Input placeholder={"E-Mail Address"} />
          <Input placeholder={"Password"} />
          <Button
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
            buttonText="Register"
            reverse={true}
            onPress={() => {
              console.log("register pressed");
            }}
          />
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;
