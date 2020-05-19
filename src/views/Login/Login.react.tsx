import React from "react";
import { connect } from "react-redux";
import { Button } from "@components";

const LoginScreenBase: React.FC = (props) => {
  console.log(props);
  return (
    <Button
      buttonText="login"
      onPress={() => {
        console.log("login pressed");
      }}
    />
  );
};

const mapStateToProps = (state: any) => ({ user: state.user });
const mapDispatchToProps = () => {};

const LoginScreen = connect(mapStateToProps)(LoginScreenBase);

export default LoginScreen;
