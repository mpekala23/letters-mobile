import React, { createRef } from "react";
import {
  KeyboardAvoidingView,
  View,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import { Colors, Typography } from "@styles";
import { AppStackParamList } from "navigations";
import { StackNavigationProp } from "@react-navigation/stack";
import Styles from "./FacilityDirectory.styles";
import CommonStyles from "./AddContact.styles";
import { Button, Input } from "@components";
import { Validation } from "utils";
import { Facility } from "types";

type AddManuallyScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  "AddManually"
>;

export interface Props {
  navigation: AddManuallyScreenNavigationProp;
}

export interface State {
  inputting: boolean;
  valid: boolean;
}

class AddManuallyScreen extends React.Component<Props, State> {
  private facilityName = createRef<Input>();
  private facilityAddress = createRef<Input>();
  private facilityCity = createRef<Input>();
  private facilityPostal = createRef<Input>();

  constructor(props: Props) {
    super(props);
    this.state = {
      inputting: false,
      valid: false,
    };
    this.updateValid = this.updateValid.bind(this);
  }

  updateValid() {
    if (
      this.facilityName.current &&
      this.facilityAddress.current &&
      this.facilityCity.current &&
      this.facilityPostal.current
    ) {
      const result =
        this.facilityName.current.state.valid &&
        this.facilityAddress.current.state.valid &&
        this.facilityCity.current.state.valid &&
        this.facilityPostal.current.state.valid;
      this.setState({ valid: result });
    }
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
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          enabled
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              scrollEnabled={this.state.inputting}
              style={{ width: "100%" }}
            >
              <View style={{ width: "100%", height: 40 }} />
              <View style={CommonStyles.contactbackground}>
                <Typography.PageHeader text="Add A Facility" />
                <Input
                  ref={this.facilityName}
                  parentStyle={{ ...CommonStyles.fullWidth, marginTop: 10 }}
                  placeholder="Facility Name"
                  required
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                  nextInput={this.facilityAddress}
                />
                <Input
                  ref={this.facilityAddress}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Facility Address"
                  required
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                  nextInput={this.facilityCity}
                />
                <Input
                  ref={this.facilityCity}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Facility City"
                  required
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                  nextInput={this.facilityPostal}
                />
                <Input
                  ref={this.facilityPostal}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Facility Postal"
                  required
                  validate={Validation.Zipcode}
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
        <View style={CommonStyles.bottomButtonContainer}>
          <Button
            onPress={() => {
              this.props.navigation.navigate("FacilityDirectory");
            }}
            buttonText="Back"
            reverse
            containerStyle={CommonStyles.bottomButton}
          />
          <Button
            onPress={() => {
              if (
                this.facilityName.current &&
                this.facilityAddress.current &&
                this.facilityCity.current &&
                this.facilityPostal.current
              ) {
                const facility: Facility = {
                  name: this.facilityName.current.state.value,
                  type: "State Prison",
                  address: this.facilityAddress.current.state.value,
                  city: this.facilityCity.current.state.value,
                  state: "MN",
                  postal: this.facilityPostal.current.state.value,
                };
                this.props.navigation.navigate("FacilityDirectory", {
                  newFacility: facility,
                });
              } else {
                this.props.navigation.navigate("FacilityDirectory");
              }
            }}
            buttonText="Next"
            enabled={this.state.valid}
            containerStyle={CommonStyles.bottomButton}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

export default AddManuallyScreen;
