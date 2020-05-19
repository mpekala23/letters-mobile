import React from "react";
import { Button } from "@components";

const LoginScreen: React.FC = (props) => {
  return (
    <Button
      buttonText="login"
      onPress={() => {
        console.log("login pressed");
      }}
    />
  );
};

export default LoginScreen;
