import React, { createRef, Dispatch } from "react";
import {
  Alert,
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
import Styles from "./ReviewContact.styles";
import CommonStyles from "./AddContact.styles";
import { Button, Input, PicUpload } from "@components";
import { STATES_DROPDOWN, Validation } from "@utils";
import { AppState } from "store/types";
import store from "@store";
import {
  Contact,
  ContactActionTypes,
  ContactState,
} from "store/Contact/ContactTypes";
import { Facility } from "types";
import { addContact } from "@api";
import { getDropdownRef } from "@components/Dropdown/Dropdown.react";
import DropdownAlert from "react-native-dropdownalert";
import { setAdding } from "store/Contact/ContactActions";
import { connect } from "react-redux";

type ReviewContactScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  "ReviewContact"
>;

export interface Props {
  navigation: ReviewContactScreenNavigationProp;
  contactState: ContactState;
  setAdding: (contact: Contact) => void;
}

export interface State {
  valid: boolean;
}

class ReviewContactScreenBase extends React.Component<Props, State> {
  private stateRef = createRef<Input>();
  private firstName = createRef<Input>();
  private lastName = createRef<Input>();
  private postal = createRef<Input>();
  private facilityName = createRef<Input>();
  private facilityAddress = createRef<Input>();
  private unit = createRef<Input>();
  private dorm = createRef<Input>();
  private unsubscribeFocus: () => void;
  private dropdownRef = createRef<DropdownAlert>();

  constructor(props: Props) {
    super(props);
    this.state = {
      valid: false,
    };
    this.updateValid = this.updateValid.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.unsubscribeFocus = props.navigation.addListener(
      "focus",
      this.onNavigationFocus
    );
    this.dropdownRef = getDropdownRef();
    this.doAddContact = this.doAddContact.bind(this);
  }

  componentDidMount() {
    this.onNavigationFocus();
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
  }

  onNavigationFocus() {
    if (
      this.stateRef.current &&
      this.firstName.current &&
      this.lastName.current &&
      this.postal.current &&
      this.facilityName.current &&
      this.facilityAddress.current &&
      this.props.contactState.adding.facility
    ) {
      this.stateRef.current.set(this.props.contactState.adding.state);
      this.firstName.current.set(this.props.contactState.adding.firstName);
      this.lastName.current.set(this.props.contactState.adding.lastName);
      this.postal.current.set(this.props.contactState.adding.facility.postal);
      this.facilityName.current.set(
        this.props.contactState.adding.facility.name
      );
      this.facilityAddress.current.set(
        this.props.contactState.adding.facility.address
      );
    }
  }

  updateValid() {
    if (
      this.stateRef.current &&
      this.firstName.current &&
      this.lastName.current &&
      this.postal.current &&
      this.facilityName.current &&
      this.facilityAddress.current
    ) {
      const result =
        this.stateRef.current.state.valid &&
        this.firstName.current.state.valid &&
        this.lastName.current.state.valid &&
        this.postal.current.state.valid &&
        this.facilityName.current.state.valid &&
        this.facilityAddress.current.state.valid;
      this.setState({ valid: result });
    }
  }

  doAddContact = async () => {
    if (
      this.state.valid &&
      this.stateRef.current &&
      this.firstName.current &&
      this.lastName.current &&
      this.postal.current &&
      this.facilityName.current &&
      this.facilityAddress.current &&
      this.props.contactState.adding.facility
    ) {
      const facility: Facility = {
        name: this.facilityName.current.state.value,
        type: this.props.contactState.adding.facility.type,
        address: this.facilityAddress.current.state.value,
        city: this.props.contactState.adding.facility.city,
        state: this.props.contactState.adding.facility.state,
        postal: this.postal.current.state.value,
      };
      const contact = {
        state: this.stateRef.current.state.value,
        first_name: this.firstName.current.state.value,
        last_name: this.lastName.current.state.value,
        inmate_number: this.props.contactState.adding.inmateNumber,
        relationship: this.props.contactState.adding.relationship,
        facility: facility,
      };
      try {
        const { existing } = store.getState().contact;
        // Check if contact being added already exists
        for (let ix = 0; ix < existing.length; ix++) {
          if (
            existing[ix].firstName === contact.first_name &&
            existing[ix].lastName === contact.last_name &&
            existing[ix].inmateNumber === contact.inmate_number &&
            existing[ix].state === contact.state &&
            existing[ix].relationship === contact.relationship &&
            existing[ix].facility?.name === contact.facility.name &&
            existing[ix].facility?.address === contact.facility.address && 
            existing[ix].facility?.city === contact.facility.city &&
            existing[ix].facility?.postal === contact.facility.postal &&
            existing[ix].facility?.state === contact.facility.state &&
            existing[ix].facility?.type === contact.facility.type 
          ) {
            throw Error("Contact already exists");
            break;
          }
        }
        const data = await addContact(contact);
        this.props.navigation.navigate("ContactSelector");
      } catch (err) {
        if (err.message === "Invalid inmate number") {
          Alert.alert("Invalid inmate number");
        } else if (err.message === "Contact already exists") {
          Alert.alert("Contact already exists");
        } else {
          if (this.dropdownRef.current)
            this.dropdownRef.current.alertWithType(
              "error",
              "Network Error",
              "The request could not be completed."
            );
        }
      }
    }
  };

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
              style={{ width: "100%" }}
            >
              <View style={{ width: "100%", height: 40 }} />
              <View style={CommonStyles.contactbackground}>
                <Typography.PageHeader text="Review Contact" />
                <View style={{ alignSelf: "center", marginVertical: 10 }}>
                  <View style={{ alignSelf: "center" }}>
                    <PicUpload />
                  </View>
                  <Text style={Typography.FONT_ITALIC}>
                    Click to upload contact's image.
                  </Text>
                </View>
                <Input
                  ref={this.stateRef}
                  parentStyle={[CommonStyles.fullWidth, { marginTop: 10 }]}
                  placeholder="State"
                  options={STATES_DROPDOWN}
                  validate={Validation.State}
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.firstName}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="First Name"
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.lastName}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Last Name"
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.postal}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Postal"
                  required
                  validate={Validation.Zipcode}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.facilityName}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Facility Name"
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.facilityAddress}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Facility Address"
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.unit}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Unit (optional, only if needed)"
                />
                <Input
                  ref={this.dorm}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder="Dorm (optional, only if needed)"
                />
                <View style={{ width: "100%", height: 80 }} />
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
            onPress={this.doAddContact}
            buttonText="Add Contact"
            enabled={this.state.valid}
            containerStyle={CommonStyles.bottomButton}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  contactState: state.contact,
});
const mapDispatchToProps = (dispatch: Dispatch<ContactActionTypes>) => {
  return {
    setAdding: (contact: Contact) => dispatch(setAdding(contact)),
  };
};
const ReviewContactScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewContactScreenBase);

export default ReviewContactScreen;
