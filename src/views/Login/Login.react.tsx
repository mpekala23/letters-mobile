import React from "react";
import { KeyboardAvoidingView } from "react-native";
import { login } from "@api";
import { Button } from "@components";
import Styles from "./Login.styles";

const LoginScreen: React.FC = (props) => {
  return (
    <KeyboardAvoidingView style={Styles.loginBackground}>
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
  );
};

export default LoginScreen;
