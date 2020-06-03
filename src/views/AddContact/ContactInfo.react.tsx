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
import { AMEELIO_BLACK } from "styles/Colors";
import { AuthStackParamList } from "navigations";
import { StackNavigationProp } from "@react-navigation/stack";
import { States, Validation } from "@utils";

type ContactInfoScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "Login"
>;

export interface Props {
  navigation: ContactInfoScreenNavigationProp;
}

export interface State {
  inputting: boolean;
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
    };
    this.stateRef = createRef();
    this.firstName = createRef();
    this.lastName = createRef();
    this.inmateNumber = createRef();
    this.relationship = createRef();
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
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              scrollEnabled={this.state.inputting}
            >
              <View style={{ width: "100%", height: 40 }} />
              <View style={Styles.contactbackground}>
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
                  parentStyle={Styles.fullWidth}
                  placeholder="State"
                  options={States.STATES}
                  validate={Validation.State}
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  nextInput={this.firstName}
                />
                <Input
                  ref={this.firstName}
                  parentStyle={Styles.fullWidth}
                  placeholder="First Name"
                  required
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  nextInput={this.lastName}
                />
                <Input
                  ref={this.lastName}
                  parentStyle={Styles.fullWidth}
                  placeholder="Last Name"
                  required
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  nextInput={this.inmateNumber}
                />
                <Input
                  ref={this.inmateNumber}
                  parentStyle={Styles.fullWidth}
                  placeholder="Inmate Number"
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  nextInput={this.relationship}
                />
                <Input
                  ref={this.relationship}
                  parentStyle={Styles.fullWidth}
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
                />
                <View style={Styles.bottomButtonContainer}>
                  <Button
                    onPress={() => {}}
                    buttonText="Back"
                    reverse
                    containerStyle={Styles.bottomButton}
                  />
                  <Button
                    onPress={() => {}}
                    buttonText="Next"
                    containerStyle={Styles.bottomButton}
                  />
                </View>
              </View>
              <View style={{ width: "100%", height: 100 }} />
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  }
}

export default ContactInfoScreen;
