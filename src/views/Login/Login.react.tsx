import React from "react";
import { login } from "@api";
import { Button } from "@components";

const LoginScreen: React.FC = (props) => {
  return (
    <Button
      buttonText="login"
      onPress={() => {
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
  );
};

export default LoginScreen;
