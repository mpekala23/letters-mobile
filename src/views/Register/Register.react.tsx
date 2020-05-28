import React, { createRef } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Button, Input, PicUpload } from "@components";
import { getDropdownRef } from "@components/Dropdown/Dropdown.react";
import Styles from "./Register.style";
import { Typography } from "@styles";
import { register } from "@api";

export interface State {
  valid: boolean;
}

class RegisterScreen extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.firstName = createRef();
    this.lastName = createRef();
    this.cell = createRef();
    this.address1 = createRef();
    this.address2 = createRef();
    this.country = createRef();
    this.zipcode = createRef();
    this.city = createRef();
    this.phyState = createRef();
    this.email = createRef();
    this.password = createRef();
    this.dropdownRef = getDropdownRef();
    this.state = {
      valid: false,
    };
  }

  devSkip = () => {
    console.log("here");
    this.firstName.current.set("Mark");
    this.lastName.current.set("Pekala");
    this.cell.current.set("6127038623");
    this.address1.current.set("210 W Diamond Lake Road");
    this.country.current.set("USA");
    this.zipcode.current.set("55419");
    this.city.current.set("Minneapolis");
    this.phyState.current.set("MN");
    this.email.current.set("mpekala@college.harvard.edu");
    this.password.current.set("ThisGoodPassword1#");
  };

  updateValid = () => {
    const result =
      this.firstName.current.state.valid &&
      this.lastName.current.state.valid &&
      this.cell.current.state.valid &&
      this.address1.current.state.valid &&
      this.country.current.state.valid &&
      this.zipcode.current.state.valid &&
      this.city.current.state.valid &&
      this.phyState.current.state.valid &&
      this.email.current.state.valid &&
      this.password.current.state.valid;
    this.setState({ valid: result });
  };

  doRegister = () => {
    const data: User = {
      firstName: this.firstName.current.state.value,
      lastName: this.lastName.current.state.value,
      cell: this.cell.current.state.value,
      address1: this.address1.current.state.value,
      address2: this.address2.current.state.value,
      country: this.country.current.state.value,
      zipcode: this.zipcode.current.state.value,
      city: this.city.current.state.value,
      state: this.phyState.current.state.value,
      email: this.email.current.state.value,
      password: this.password.current.state.value,
    };
    register(data)
      .then((data) => {
        console.log("data received");
        console.log(data);
      })
      .catch((err) => {
        console.log("nope it went wrong");
        console.log(err.message);
        if (err.message === "Email in use") {
          Alert.alert("Email already in use");
        } else if (err.message === "timeout") {
          // time out
          this.dropdownRef.alertWithType(
            "error",
            "Network Error",
            "The request timed out."
          );
        } else {
          // catch all
          this.dropdownRef.alertWithType(
            "error",
            "Network Error",
            "The request could not be completed."
          );
        }
      });
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={Styles.trueBackground}
        behavior="padding"
        enabled
      >
        <ScrollView
          style={Styles.backgroundScroll}
          contentContainerStyle={Styles.scrollContent}
        >
          <View style={Styles.picContainer}>
            <PicUpload />
            <Text style={[Typography.FONT_ITALIC, { marginTop: 5 }]}>
              Click to upload profile image.
            </Text>
          </View>
          <View style={Styles.privacyBackground}>
            <Text style={[Typography.FONT_BOLD, Styles.privacyText]}>
              We value your privacy. We will only use your address information
              as the return address for the mailed letter.
            </Text>
          </View>
          <Button
            link
            buttonText="Already have an account?"
            containerStyle={{ marginBottom: 10 }}
            onPress={() => {
              this.props.navigation.navigate("Login");
            }}
          />
          <Button buttonText="Dev Skip" onPress={this.devSkip} />
          <Input
            ref={this.firstName}
            parentStyle={Styles.fullWidth}
            placeholder={"First Name"}
            required
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
          />
          <Input
            ref={this.lastName}
            parentStyle={Styles.fullWidth}
            placeholder={"Last Name"}
            required
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
          />
          <Input
            ref={this.cell}
            parentStyle={Styles.fullWidth}
            placeholder={"Cell Phone Number"}
            required
            validate={"Cell"}
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
          />
          <Input
            ref={this.address1}
            parentStyle={Styles.fullWidth}
            placeholder={"Address Line 1"}
            required
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
          />
          <Input
            ref={this.address2}
            parentStyle={Styles.fullWidth}
            placeholder={"Address Line 2"}
          />
          <Input
            ref={this.country}
            parentStyle={Styles.fullWidth}
            placeholder={"Country"}
            required
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
          />
          <Input
            ref={this.zipcode}
            parentStyle={Styles.fullWidth}
            placeholder={"Zip Code"}
            required
            validate={"Zipcode"}
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
          />
          <Input
            ref={this.city}
            parentStyle={Styles.fullWidth}
            placeholder={"City"}
            required
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
          />
          <Input
            ref={this.phyState}
            parentStyle={Styles.fullWidth}
            placeholder={"State"}
            required
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
          />
          <Input
            ref={this.email}
            parentStyle={Styles.fullWidth}
            placeholder={"Email"}
            required
            validate={"Email"}
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
          />
          <Input
            ref={this.password}
            parentStyle={Styles.fullWidth}
            placeholder={"Password"}
            required
            secure
            validate={"Password"}
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
          />
          <Button
            containerStyle={Styles.fullWidth}
            buttonText="Register"
            enabled={this.state.valid}
            onPress={this.doRegister}
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default RegisterScreen;
