import React, { createRef, Dispatch } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Keyboard,
  Platform,
} from 'react-native';
import { Typography } from '@styles';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { Button, Input, PicUpload } from '@components';
import { STATES_DROPDOWN, Validation } from '@utils';
import { AppState } from '@store/types';
import store from '@store';
import {
  Contact,
  ContactActionTypes,
  ContactState,
} from '@store/Contact/ContactTypes';
import { Facility } from 'types';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { setAdding } from '@store/Contact/ContactActions';
import { connect } from 'react-redux';
import { addContact } from '@api';
import i18n from '@i18n';
import { popupAlert } from 'components/Alert/Alert.react';
import CommonStyles from './AddContact.styles';

type ReviewContactScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ReviewContact'
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

  constructor(props: Props) {
    super(props);
    this.state = {
      valid: false,
    };
    this.updateValid = this.updateValid.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.unsubscribeFocus = props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
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
      // TO-DO: Replace random contactId for mocking purposes with real Ids
      const randomContactId = Math.floor(Math.random() * 1000);
      const contact = {
        id: randomContactId,
        state: this.stateRef.current.state.value,
        first_name: this.firstName.current.state.value,
        last_name: this.lastName.current.state.value,
        inmate_number: this.props.contactState.adding.inmateNumber,
        relationship: this.props.contactState.adding.relationship,
        facility,
      };
      try {
        const { existing } = store.getState().contact;
        // Check if contact being added already exists
        for (let ix = 0; ix < existing.length; ix += 1) {
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
            throw Error('Contact already exists');
          }
        }
        await addContact(contact);
        this.props.navigation.navigate('ContactSelector');
      } catch (err) {
        if (err.message === 'Invalid inmate number') {
          popupAlert({
            title: i18n.t('ReviewContactScreen.invalidInmateNumber'),
            message: '',
            buttons: [
              {
                text: i18n.t('Alert.okay'),
                reverse: false,
                onPress: () => null,
              },
            ],
          });
        } else if (err.message === 'Contact already exists') {
          popupAlert({
            title: i18n.t('ReviewContactScreen.contactAlreadyExists'),
            message: '',
            buttons: [
              {
                text: i18n.t('Alert.okay'),
                reverse: false,
                onPress: () => null,
              },
            ],
          });
        } else {
          dropdownError({ message: i18n.t('Error.requestIncomplete') });
        }
      }
    }
  };

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

  render() {
    return (
      <TouchableOpacity
        style={{ flex: 1, backgroundColor: 'white' }}
        onPress={() => Keyboard.dismiss()}
        activeOpacity={1.0}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          enabled
        >
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={{ width: '100%' }}
            >
              <View style={{ width: '100%', height: 40 }} />
              <View style={CommonStyles.contactbackground}>
                <Typography.PageHeader
                  text={i18n.t('ReviewContactScreen.reviewContact')}
                />
                <View style={{ alignSelf: 'center', marginVertical: 10 }}>
                  <View style={{ alignSelf: 'center' }}>
                    <PicUpload />
                  </View>
                  <Text style={Typography.FONT_REGULAR_ITALIC}>
                    {i18n.t('ReviewContactScreen.clickToUploadContactImage')}
                  </Text>
                </View>
                <Input
                  ref={this.stateRef}
                  parentStyle={{
                    width: '100%',
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                  placeholder={i18n.t('ContactInfoScreen.state')}
                  options={STATES_DROPDOWN}
                  validate={Validation.State}
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.firstName}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('ContactInfoScreen.firstName')}
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.lastName}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('ContactInfoScreen.lastName')}
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.postal}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('ContactInfoScreen.postal')}
                  required
                  validate={Validation.Postal}
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.facilityName}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('AddManuallyScreen.facilityName')}
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.facilityAddress}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('AddManuallyScreen.facilityAddress')}
                  required
                  onValid={this.updateValid}
                  onInvalid={() => this.setState({ valid: false })}
                />
                <Input
                  ref={this.unit}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('ReviewContactScreen.optionalUnit')}
                />
                <Input
                  ref={this.dorm}
                  parentStyle={CommonStyles.fullWidth}
                  placeholder={i18n.t('ReviewContactScreen.optionalDorm')}
                />
                <View style={{ width: '100%', height: 80 }} />
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
        <View style={CommonStyles.bottomButtonContainer}>
          <Button
            onPress={() => {
              this.props.navigation.navigate('FacilityDirectory');
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
