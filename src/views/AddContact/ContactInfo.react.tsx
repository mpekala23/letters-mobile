import React, { createRef, Dispatch } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { Button, Input } from "@components";
import { Typography } from "@styles";
import Styles from "./ContactInfo.styles";
import CommonStyles from "./AddContact.styles";
import { AMEELIO_BLACK } from "styles/Colors";
import { AppStackParamList } from "navigations";
import { StackNavigationProp } from "@react-navigation/stack";
import { STATES_DROPDOWN, Validation } from "@utils";
import { connect } from "react-redux";
import { AppState } from "@store/types";
import { setAdding } from "@store/Contact/ContactActions";
import {
  ContactState,
  Contact,
  ContactActionTypes,
} from "@store/Contact/ContactTypes";
import { UserState } from "@store/User/UserTypes";

type ContactInfoScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  "ContactInfo"
>;

export interface Props {
  navigation: ContactInfoScreenNavigationProp;
  userState: UserState;
  contactState: ContactState;
  setAdding: (contact: Contact) => void;
}

export interface State {
  inputting: boolean;
  valid: boolean;
  stateToSearch: string;
}

class ContactInfoScreenBase extends React.Component<Props, State> {
  private stateRef = createRef<Input>();
  private first_name = createRef<Input>();
  private last_name = createRef<Input>();
  private inmate_number = createRef<Input>();
  private relationship = createRef<Input>();
  private unsubscribeFocus: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      inputting: false,
      valid: false,
      stateToSearch: props.userState.user.state,
    };
    this.updateValid = this.updateValid.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.unsubscribeFocus = props.navigation.addListener(
      "focus",
      this.onNavigationFocus
    );
  }

  componentDidMount() {
    this.onNavigationFocus();
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
  }

  onNavigationFocus() {
    const addingContact = this.props.contactState.adding;
    if (this.stateRef.current) this.stateRef.current.set(addingContact.state);
    if (this.first_name.current)
      this.first_name.current.set(addingContact.first_name);
    if (this.last_name.current)
      this.last_name.current.set(addingContact.last_name);
    if (this.inmate_number.current)
      this.inmate_number.current.set(addingContact.inmate_number);
    if (this.relationship.current)
      this.relationship.current.set(addingContact.relationship);
  }

  updateValid() {
    if (
      this.stateRef.current &&
      this.first_name.current &&
      this.last_name.current &&
      this.inmate_number.current &&
      this.relationship.current
    ) {
      const result =
        this.stateRef.current.state.valid &&
        this.first_name.current.state.valid &&
        this.last_name.current.state.valid &&
        this.inmate_number.current.state.valid &&
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
                      {this.state.stateToSearch}
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
                  options={STATES_DROPDOWN}
                  validate={Validation.State}
                  onFocus={() => {
                    this.setState({ inputting: true });
                  }}
                  onBlur={() => {
                    this.setState({ inputting: false });
                  }}
                  onValid={() => {
                    if (this.stateRef.current)
                      this.setState({
                        stateToSearch: this.stateRef.current?.state.value,
                      });
                    this.updateValid();
                  }}
                  onInvalid={() => this.setState({ valid: false })}
                  nextInput={this.first_name}
                />
                <Input
                  ref={this.first_name}
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
                  nextInput={this.last_name}
                />
                <Input
                  ref={this.last_name}
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
                  nextInput={this.inmate_number}
                />
                <Input
                  ref={this.inmate_number}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Inmate Number"
                  required
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
                  required
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
                  if (
                    this.stateRef.current &&
                    this.first_name.current &&
                    this.last_name.current &&
                    this.inmate_number.current &&
                    this.relationship.current
                  ) {
                    const contact: Contact = {
                      state: this.stateRef.current.state.value,
                      first_name: this.first_name.current.state.value,
                      last_name: this.last_name.current.state.value,
                      inmate_number: this.inmate_number.current.state.value,
                      relationship: this.relationship.current.state.value,
                      facility: this.props.contactState.adding.facility,
                    };
                    this.props.setAdding(contact);
                  }
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

const mapStateToProps = (state: AppState) => ({
  userState: state.user,
  contactState: state.contact,
});
const mapDispatchToProps = (dispatch: Dispatch<ContactActionTypes>) => {
  return {
    setAdding: (contact: Contact) => dispatch(setAdding(contact)),
  };
};
const ContactInfoScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactInfoScreenBase);

export default ContactInfoScreen;
