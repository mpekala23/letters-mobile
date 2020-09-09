import React, { createRef, Dispatch } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { Typography } from '@styles';
import { AppStackParamList, Screens } from '@utils/Screens';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Button,
  Input,
  PicUpload,
  KeyboardAvoider,
  Picker,
  PickerRef,
} from '@components';
import { STATES_DROPDOWN, Validation, hoursTill8Tomorrow } from '@utils';
import { AppState } from '@store/types';
import store from '@store';
import { ContactActionTypes, ContactState } from '@store/Contact/ContactTypes';
import { ContactDraft, Facility, Image, Contact } from 'types';
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

export interface Props {
  navigation: ReviewContactScreenNavigationProp;
  contactState: ContactState;
  hasSentLetter: boolean;
  setAdding: (contactDraft: ContactDraft) => void;
  setActiveContact: (contact: Contact) => void;
  route: { params: { manual: boolean } };
}

export interface State {
  valid: boolean;
  image: Image | null;
}

class ReviewContactScreenBase extends React.Component<Props, State> {
  private statePicker = createRef<PickerRef>();

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
      this.statePicker.current &&
      this.firstName.current &&
      this.lastName.current &&
      this.postal.current &&
      this.facilityName.current &&
      this.facilityAddress.current &&
      this.props.contactState.adding.facility
    ) {
      this.statePicker.current.setValue(
        this.props.contactState.adding.facility.state
      );
      this.statePicker.current.setIsStoredValue(true);
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
      this.statePicker.current &&
      this.firstName.current &&
      this.lastName.current &&
      this.postal.current &&
      this.facilityName.current &&
      this.facilityAddress.current
    ) {
      const facility: Facility = {
        name: this.facilityName.current.state.value,
        type: this.props.contactState.adding.facility.type,
        address: this.facilityAddress.current.state.value,
        city: this.props.contactState.adding.facility.city,
        state: this.statePicker.current.value,
        postal: this.postal.current.state.value,
        phone: this.props.contactState.adding.facility.phone,
      };
      const contactDraft: ContactDraft = {
        firstName: this.firstName.current.state.value,
        lastName: this.lastName.current.state.value,
        inmateNumber: this.props.contactState.adding.inmateNumber,
        relationship: this.props.contactState.adding.relationship,
        facility,
        image: this.state.image ? this.state.image : undefined,
        unit: this.unit.current?.state.value,
        dorm: this.dorm.current?.state.value,
      };
      try {
        const { existing } = store.getState().contact;
        // Check if contact being added already exists
        for (let ix = 0; ix < existing.length; ix += 1) {
          if (
            existing[ix].firstName === contactDraft.firstName &&
            existing[ix].lastName === contactDraft.lastName &&
            existing[ix].inmateNumber === contactDraft.inmateNumber &&
            existing[ix].relationship === contactDraft.relationship &&
            existing[ix].facility.name === contactDraft.facility.name &&
            existing[ix].facility.address === contactDraft.facility.address &&
            existing[ix].facility.city === contactDraft.facility.city &&
            existing[ix].facility.postal === contactDraft.facility.postal &&
            existing[ix].facility.state === contactDraft.facility.state &&
            existing[ix].facility.type === contactDraft.facility.type
          ) {
            throw Error('Contact already exists');
          }
        }
        const newContact = await addContact(contactDraft);
        Segment.trackWithProperties('Add Contact - Success', {
          relationship: newContact.relationship,
          facility: newContact.facility.name,
          facilityCity: newContact.facility.city,
          facilityState: newContact.facility.state,
          facilityPostal: newContact.facility.postal,
          facilityType: newContact.facility.type,
          Manual: this.props.route.params.manual,
        });
        Notifs.cancelAllNotificationsByType(NotifTypes.NoFirstContact);
        if (!this.props.hasSentLetter) {
          Notifs.scheduleNotificationInHours(
            {
              title: `${i18n.t('Notifs.readyToSend')} ${newContact.firstName}?`,
              body: `${i18n.t('Notifs.clickHereToBegin')}`,
              data: {
                type: NotifTypes.NoFirstLetter,
                data: {
                  contactId: newContact.id,
                },
              },
            },
            hoursTill8Tomorrow() + 24
          );
        }
        this.props.setActiveContact(newContact);
        this.props.navigation.reset({
          index: 0,
          routes: [
            { name: Screens.ContactSelector },
            { name: Screens.SingleContact },
          ],
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
      this.statePicker.current &&
      this.firstName.current &&
      this.lastName.current &&
      this.postal.current &&
      this.facilityName.current &&
      this.facilityAddress.current
    ) {
      const result =
        this.statePicker.current.isValueSelected() &&
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
        <KeyboardAvoider>
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
                <View style={{ width: '100%', marginTop: 10 }}>
                  <Picker
                    ref={this.statePicker}
                    items={STATES_DROPDOWN.map((el) => el[0])}
                    placeholder={i18n.t('ContactInfoScreen.state')}
                    onValueChange={() => {
                      this.updateValid();
                    }}
                  />
                  <Input
                    ref={this.firstName}
                    placeholder={i18n.t('ContactInfoScreen.firstName')}
                    required
                    onValid={this.updateValid}
                    onInvalid={() => this.setState({ valid: false })}
                  />
                  <Input
                    ref={this.lastName}
                    placeholder={i18n.t('ContactInfoScreen.lastName')}
                    required
                    onValid={this.updateValid}
                    onInvalid={() => this.setState({ valid: false })}
                  />
                  <Input
                    ref={this.postal}
                    placeholder={i18n.t('ContactInfoScreen.postal')}
                    required
                    validate={Validation.Postal}
                    onValid={this.updateValid}
                    onInvalid={() => this.setState({ valid: false })}
                  />
                  <Input
                    ref={this.facilityName}
                    placeholder={i18n.t('AddManuallyScreen.facilityName')}
                    required
                    onValid={this.updateValid}
                    onInvalid={() => this.setState({ valid: false })}
                  />
                  <Input
                    ref={this.facilityAddress}
                    placeholder={i18n.t('AddManuallyScreen.facilityAddress')}
                    required
                    onValid={this.updateValid}
                    onInvalid={() => this.setState({ valid: false })}
                  />
                  <Input
                    ref={this.unit}
                    placeholder={i18n.t('ReviewContactScreen.optionalUnit')}
                  />
                  <Input
                    ref={this.dorm}
                    placeholder={i18n.t('ReviewContactScreen.optionalDorm')}
                  />
                </View>
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
        </KeyboardAvoider>
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
    setAdding: (contactDraft: ContactDraft) =>
      dispatch(setAdding(contactDraft)),
  };
};
const ReviewContactScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReviewContactScreenBase);

export default ReviewContactScreen;
