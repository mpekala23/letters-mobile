import React, { createRef } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Input } from "@components";
import { Typography } from "@styles";
import Styles from "./ContactInfo.styles";
import CommonStyles from "./AddContact.styles";
import { AMEELIO_BLACK } from "styles/Colors";
import { AppStackParamList } from "navigations";
import { StackNavigationProp } from "@react-navigation/stack";
import { States, Validation } from "@utils";

type ContactInfoScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  "ContactInfo"
>;

export interface Props {
  navigation: ContactInfoScreenNavigationProp;
}

export interface State {
  inputting: boolean;
  valid: boolean;
}

class ContactInfoScreen extends React.Component<Props, State> {
  private stateRef = createRef<Input>();
  private firstName = createRef<Input>();
  private lastName = createRef<Input>();
  private inmateNumber = createRef<Input>();
  private relationship = createRef<Input>();

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
      this.stateRef.current &&
      this.firstName.current &&
      this.lastName.current &&
      this.inmateNumber.current &&
      this.relationship.current
    ) {
      const result =
        this.stateRef.current.state.valid &&
        this.firstName.current.state.valid &&
        this.lastName.current.state.valid &&
        this.inmateNumber.current.state.valid &&
        this.relationship.current.state.valid;
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
          behavior="padding"
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
                <Typography.PageHeader text="Add Contact" />
                <Button
                  link
                  buttonText="Need help finding your inmate ID?"
                  containerStyle={{ marginTop: 10, alignSelf: "flex-start" }}
                  onPress={() => {}}
                />
                <Button
                  link
                  containerStyle={{ marginTop: 10, alignSelf: "flex-start" }}
                  onPress={() => {}}
                >
                  <Text>
                    Tap here to search the{" "}
                    <Text
                      style={[Typography.FONT_BOLD, { color: AMEELIO_BLACK }]}
                    >
                      Arizona
                    </Text>{" "}
                    database.
                  </Text>
                </Button>
                <Button
                  link
                  containerStyle={{
                    marginTop: 10,
                    marginBottom: 30,
                    alignSelf: "flex-start",
                  }}
                  onPress={() => {}}
                >
                  <Text>
                    Tap here to search the{" "}
                    <Text
                      style={[Typography.FONT_BOLD, { color: AMEELIO_BLACK }]}
                    >
                      Federal
                    </Text>{" "}
                    database.
                  </Text>
                </Button>
                <Input
                  ref={this.stateRef}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="State"
                  options={States.STATES}
                  validate={Validation.State}
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                  nextInput={this.firstName}
                />
                <Input
                  ref={this.firstName}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="First Name"
                  required
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                  nextInput={this.lastName}
                />
                <Input
                  ref={this.lastName}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Last Name"
                  required
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                  nextInput={this.inmateNumber}
                />
                <Input
                  ref={this.inmateNumber}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Inmate Number"
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                  nextInput={this.relationship}
                />
                <Input
                  ref={this.relationship}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Relationship to Inmate"
                  options={[
                    "Mother",
                    "Father",
                    "Brother",
                    "Sister",
                    "Sibling",
                    "Daughter",
                    "Son",
                    "Grandmother",
                    "Grandfather",
                    "Grandaughter",
                    "Grandson",
                    "Friend",
                    "Other",
                  ]}
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
            <View style={CommonStyles.bottomButtonContainer}>
              <Button
                onPress={() => {}}
                buttonText="Back"
                reverse
                containerStyle={CommonStyles.bottomButton}
              />
              <Button
                onPress={() => {
                  this.props.navigation.navigate("FacilityDirectory");
                }}
                buttonText="Next"
                enabled={this.state.valid}
                containerStyle={CommonStyles.bottomButton}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  }
}

export default ContactInfoScreen;
