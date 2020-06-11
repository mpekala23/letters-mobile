import React, { createRef } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "@navigations";
import { Button, Input, PicUpload } from "@components";
import { getDropdownRef } from "@components/Dropdown/Dropdown.react";
import DropdownAlert from "react-native-dropdownalert";
import Styles from "./Register.style";
import { Typography } from "@styles";
import { register } from "@api";
import { Validation } from "@utils";
import { User, UserInfo } from "@store/User/UserTypes";

type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Register"
>;

export interface Props {
  navigation: RegisterScreenNavigationProp;
}

export interface State {
  valid: boolean;
  registered: boolean;
}

class RegisterScreen extends React.Component<Props, State> {
  private firstName = createRef<Input>();
  private lastName = createRef<Input>();
  private cell = createRef<Input>();
  private address1 = createRef<Input>();
  private address2 = createRef<Input>();
  private country = createRef<Input>();
  private zipcode = createRef<Input>();
  private city = createRef<Input>();
  private phyState = createRef<Input>();
  private email = createRef<Input>();
  private password = createRef<Input>();
  private dropdownRef = createRef<DropdownAlert>();

  constructor(props: Props) {
    super(props);
    this.state = {
      valid: false,
      registered: false,
    };
  }

  devSkip = () => {
    if (this.firstName.current) this.firstName.current.set("Team");
    if (this.lastName.current) this.lastName.current.set("Ameelio");
    if (this.cell.current) this.cell.current.set("4324324432");
    if (this.address1.current) this.address1.current.set("Somewhere");
    if (this.country.current) this.country.current.set("USA");
    if (this.zipcode.current) this.zipcode.current.set("12345");
    if (this.city.current) this.city.current.set("New Haven");
    if (this.phyState.current) this.phyState.current.set("CT");
    if (this.email.current) this.email.current.set("team@ameelio.org");
    if (this.password.current) this.password.current.set("ThisGood1");
    this.updateValid();
  };

  updateValid = () => {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.cell.current &&
      this.address1.current &&
      this.country.current &&
      this.zipcode.current &&
      this.city.current &&
      this.phyState.current &&
      this.email.current &&
      this.password.current
    ) {
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
    }
  };

  doRegister = async () => {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.cell.current &&
      this.address1.current &&
      this.address2.current &&
      this.country.current &&
      this.zipcode.current &&
      this.city.current &&
      this.phyState.current &&
      this.email.current &&
      this.password.current
    ) {
      const data: UserInfo = {
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
      try {
        const res = await register(data);
        this.setState({ registered: true });
      } catch (err) {
        if (err.message === "Email in use") {
          Alert.alert("Email already in use");
        } else if (err.message === "timeout") {
          if (this.dropdownRef.current)
            this.dropdownRef.current.alertWithType(
              "error",
              "Network Error",
              "The request timed out."
            );
        } else {
          // catch all
          if (this.dropdownRef.current)
            this.dropdownRef.current.alertWithType(
              "error",
              "Network Error",
              "The request could not be completed."
            );
        }
        this.setState({ registered: false });
      }
    }
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
          <View 
            accessible
            accessibilityLabel="Tap to upload profile image"
            style={Styles.picContainer}
          >
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
          <View style={{ flexDirection: "row" }}>
            <Input
              ref={this.cell}
              parentStyle={Styles.fullWidth}
              placeholder={"Cell Phone Number"}
              required
              validate={Validation.Cell}
              onValid={this.updateValid}
              onInvalid={() => this.setState({ valid: false })}
            />
          </View>
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
            validate={Validation.Zipcode}
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
            validate={Validation.Email}
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
          />
          <Input
            ref={this.password}
            parentStyle={Styles.fullWidth}
            placeholder={"Password"}
            required
            secure
            validate={Validation.Password}
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
          />
          <Button
            containerStyle={Styles.fullWidth}
            buttonText="Register"
            enabled={this.state.valid}
            onPress={this.doRegister}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default RegisterScreen;
