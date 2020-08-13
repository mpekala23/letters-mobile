import React, { createRef, Dispatch } from 'react';
import {
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
import { STATES_DROPDOWN, Validation, hoursTill8Tomorrow } from '@utils';
import { AppState } from '@store/types';
import store from '@store';
import {
  Contact,
  ContactActionTypes,
  ContactState,
} from '@store/Contact/ContactTypes';
import { Facility, Image } from 'types';
import { addContact } from '@api';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { setAdding, setActive } from '@store/Contact/ContactActions';
import { connect } from 'react-redux';
import i18n from '@i18n';
import { PicUploadTypes } from '@components/PicUpload/PicUpload.react';
import { popupAlert } from '@components/Alert/Alert.react';
import Notifs from '@notifications';
import { NotifTypes } from '@store/Notif/NotifTypes';
import * as Segment from 'expo-analytics-segment';
import CommonStyles from './AddContact.styles';

type ReviewContactScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'ReviewContact'
>;

export interface State {
  valid: boolean;
  image: Image | null;
}

export interface Props {
  navigation: ReviewContactScreenNavigationProp;
  contactState: ContactState;
  hasSentLetter: boolean;
  setAdding: (contact: Contact) => void;
  setActiveContact: (contact: Contact) => void;
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
      image: null,
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
      this.stateRef.current.set(this.props.contactState.adding.facility.state);
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
    Segment.trackWithProperties('Add Contact - Click on Next', {
      page: 'review',
    });
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
        state: this.stateRef.current.state.value,
        postal: this.postal.current.state.value,
        phone: this.props.contactState.adding.facility.phone,
      };
      const contact: Contact = {
        id: -1,
        firstName: this.firstName.current.state.value,
        lastName: this.lastName.current.state.value,
        inmateNumber: this.props.contactState.adding.inmateNumber,
        relationship: this.props.contactState.adding.relationship,
        facility,
        photo: this.state.image ? this.state.image : undefined,
        unit: this.unit.current?.state.value,
        dorm: this.dorm.current?.state.value,
      };
      try {
        const { existing } = store.getState().contact;
        // Check if contact being added already exists
        for (let ix = 0; ix < existing.length; ix += 1) {
          if (
            contact.facility &&
            existing[ix].firstName === contact.firstName &&
            existing[ix].lastName === contact.lastName &&
            existing[ix].inmateNumber === contact.inmateNumber &&
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
        const newContact = await addContact(contact);
        Segment.track('Add Contact - Success');
        Notifs.cancelAllNotificationsByType(NotifTypes.NoFirstContact);
        if (!this.props.hasSentLetter) {
          Notifs.scheduleNotificationInHours(
            {
              title: `${i18n.t('Notifs.readyToSend')} ${contact.firstName}?`,
              body: `${i18n.t('Notifs.clickHereToBegin')}`,
              data: {
                type: NotifTypes.NoFirstLetter,
                data: {
                  contactId: contact.id,
                },
              },
            },
            hoursTill8Tomorrow() + 24
          );
        }
        this.props.setActiveContact(newContact);
        this.props.navigation.reset({
          index: 0,
          routes: [{ name: 'ContactSelector' }, { name: 'SingleContact' }],
        });
      } catch (err) {
        if (err.message === 'Invalid inmate number') {
          Segment.trackWithProperties('Add Contact - Error', {
            'Error Type': 'missing inmate ID',
          });
          popupAlert({
            title: i18n.t('ReviewContactScreen.invalidInmateNumber'),
            buttons: [
              {
                text: i18n.t('Alert.okay'),
              },
            ],
          });
        } else if (err.message === 'Contact already exists') {
          Segment.trackWithProperties('Add Contact - Error', {
            'Error Type': 'contact already exists',
          });
          popupAlert({
            title: i18n.t('ReviewContactScreen.contactAlreadyExists'),
            buttons: [
              {
                text: i18n.t('Alert.okay'),
              },
            ],
          });
        } else {
          Segment.trackWithProperties('Add Contact - Error', {
            'Error Type': 'other',
          });
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
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : -200}
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
              <View style={{ width: '100%' }} />
              <View
                style={[
                  CommonStyles.contactbackground,
                  { alignItems: 'center' },
                ]}
              >
                <Typography.PageHeader
                  text={i18n.t('ReviewContactScreen.reviewContact')}
                />
                <View style={{ alignSelf: 'center', marginVertical: 10 }}>
                  <View style={{ alignSelf: 'center' }}>
                    <PicUpload
                      type={PicUploadTypes.Profile}
                      width={136}
                      height={136}
                      onSuccess={(image: Image) => {
                        this.setState({ image });
                      }}
                      onDelete={() => this.setState({ image: null })}
                      segmentOnPressLog={() => {
                        Segment.track('Add Contact - Press Upload Image');
                      }}
                      segmentSuccessLog={() => {
                        Segment.track('Add Contact - Upload Image');
                      }}
                      segmentErrorLogEvent="Add Contact - Failed Upload Image"
                    />
                  </View>
                  <Text
                    style={[Typography.FONT_REGULAR_ITALIC, { paddingTop: 12 }]}
                  >
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
              </View>
            </ScrollView>
          </View>
          <View style={CommonStyles.bottomButtonContainer}>
            <Button
              blocking
              onPress={this.doAddContact}
              buttonText={i18n.t('ReviewContactScreen.addContact')}
              enabled={this.state.valid}
              containerStyle={CommonStyles.bottomButton}
              showNextIcon
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  contactState: state.contact,
  hasSentLetter: state.mail.existing !== {},
});
const mapDispatchToProps = (dispatch: Dispatch<ContactActionTypes>) => {
  return {
    setActiveContact: (contact: Contact) => dispatch(setActive(contact)),
    setAdding: (contact: Contact) => dispatch(setAdding(contact)),
  };
};
const ReviewContactScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewContactScreenBase);

export default ReviewContactScreen;
