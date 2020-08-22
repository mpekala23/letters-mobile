import React, { createRef } from 'react';
import {
  Text,
  Keyboard,
  KeyboardAvoidingView,
  TouchableOpacity,
  ScrollView,
  Platform,
  View,
} from 'react-native';
import { Button, Input, PicUpload } from '@components';
import { setProfileOverride } from '@components/Topbar/Topbar.react';
import { AppStackParamList } from '@navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { Facility, Image, Contact } from 'types';
import { Typography, Colors } from '@styles';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { updateContact, deleteContact } from '@api';
import i18n from '@i18n';
import { LinearGradient } from 'expo-linear-gradient';
import { PicUploadTypes } from '@components/PicUpload/PicUpload.react';
import { popupAlert } from '@components/Alert/Alert.react';
import { Validation, STATES_DROPDOWN } from '@utils';
import * as Segment from 'expo-analytics-segment';
import Styles from './UpdateContact.styles';

type UpdateContactScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'UpdateContact'
>;

export interface Props {
  navigation: UpdateContactScreenNavigationProp;
  contact: Contact;
}

export interface State {
  image: Image | null;
}

class UpdateContactScreenBase extends React.Component<Props, State> {
  private firstName = createRef<Input>();

  private lastName = createRef<Input>();

  private facilityName = createRef<Input>();

  private facilityAddress = createRef<Input>();

  private facilityCity = createRef<Input>();

  private facilityState = createRef<Input>();

  private facilityPostal = createRef<Input>();

  private facilityPhone = createRef<Input>();

  private unit = createRef<Input>();

  private dorm = createRef<Input>();

  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      image: props.contact.image ? props.contact.image : null,
    };

    this.loadValuesFromStore = this.loadValuesFromStore.bind(this);
    this.updateValid = this.updateValid.bind(this);
    this.setValid = this.setValid.bind(this);
    this.doDeleteContact = this.doDeleteContact.bind(this);
    this.doUpdateContact = this.doUpdateContact.bind(this);
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.onNavigationBlur = this.onNavigationBlur.bind(this);

    this.unsubscribeFocus = this.props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );

    this.unsubscribeBlur = this.props.navigation.addListener(
      'blur',
      this.onNavigationBlur
    );
  }

  componentDidMount() {
    this.loadValuesFromStore();
  }

  componentWillUnmount() {
    this.unsubscribeFocus();
    this.unsubscribeBlur();
  }

  onNavigationFocus() {
    this.loadValuesFromStore();
    setProfileOverride({
      enabled: true,
      text: i18n.t('UpdateContactScreen.save'),
      action: this.doUpdateContact,
      blocking: true,
    });
  }

  onNavigationBlur = () => {
    setProfileOverride(undefined);
  };

  setValid(val: boolean) {
    setProfileOverride({
      enabled: val,
      text: i18n.t('UpdateContactScreen.save'),
      action: this.doUpdateContact,
      blocking: true,
    });
  }

  doDeleteContact = async () => {
    try {
      await deleteContact(this.props.contact.id);
      Segment.track('Edit Contact - Delete Contact');
      this.props.navigation.navigate('ContactSelector');
    } catch (err) {
      dropdownError({ message: i18n.t('Error.requestIncomplete') });
    }
  };

  doUpdateContact = async () => {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.facilityName.current &&
      this.facilityAddress.current &&
      this.facilityCity.current &&
      this.facilityState.current &&
      this.facilityPostal.current &&
      this.facilityPhone.current &&
      this.props.contact.facility
    ) {
      const facility: Facility = {
        name: this.facilityName.current.state.value,
        type: this.props.contact.facility.type,
        address: this.facilityAddress.current.state.value,
        city: this.facilityCity.current.state.value,
        state: this.facilityState.current.state.value,
        postal: this.facilityPostal.current.state.value,
        phone: this.facilityPhone.current.state.value,
      };
      const contact: Contact = {
        id: this.props.contact.id,
        firstName: this.firstName.current.state.value,
        lastName: this.lastName.current.state.value,
        inmateNumber: this.props.contact.inmateNumber,
        relationship: this.props.contact.relationship,
        facility,
        dorm: this.dorm.current?.state.value,
        unit: this.unit.current?.state.value,
        image: this.state.image ? this.state.image : undefined,
      };
      try {
        await updateContact(contact);
        Segment.track('Edit Contact - Click on Save');
        this.props.navigation.pop();
      } catch (err) {
        dropdownError({ message: i18n.t('Error.requestIncomplete') });
      }
    }
  };

  loadValuesFromStore() {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.facilityName.current &&
      this.facilityAddress.current &&
      this.facilityCity.current &&
      this.facilityState.current &&
      this.facilityPostal.current &&
      this.facilityPhone.current &&
      this.unit.current &&
      this.dorm.current &&
      this.props.contact.facility
    ) {
      this.firstName.current.set(this.props.contact.firstName);
      this.lastName.current.set(this.props.contact.lastName);
      this.facilityName.current.set(this.props.contact.facility.name);
      this.facilityAddress.current.set(this.props.contact.facility.address);
      this.facilityCity.current.set(this.props.contact.facility.city);
      this.facilityState.current.set(this.props.contact.facility.state);
      this.facilityPostal.current.set(this.props.contact.facility.postal);
      this.facilityPhone.current.set(
        this.props.contact.facility.phone
          ? this.props.contact.facility.phone
          : ''
      );
      this.dorm.current.set(
        this.props.contact.dorm ? this.props.contact.dorm : ''
      );
      this.unit.current.set(
        this.props.contact.unit ? this.props.contact.unit : ''
      );
    }
  }

  updateValid() {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.facilityName.current &&
      this.facilityAddress.current &&
      this.facilityPhone.current &&
      this.props.contact.facility
    ) {
      const result =
        this.firstName.current.state.valid &&
        this.lastName.current.state.valid &&
        this.facilityName.current.state.valid &&
        this.facilityAddress.current.state.valid &&
        this.facilityPhone.current.state.valid;
      this.setValid(result);
    }
  }

  render() {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'white',
        }}
        onPress={() => Keyboard.dismiss()}
        activeOpacity={1.0}
      >
        <KeyboardAvoidingView
          style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : -200}
          enabled
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            scrollEnabled
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingVertical: 16 }}
          >
            <View style={Styles.profileCard}>
              <LinearGradient
                colors={['#ADD3FF', '#FFC9C9']}
                style={Styles.profileCardHeader}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
              />
              <PicUpload
                shapeBackground={{
                  borderWidth: 6,
                  borderColor: 'white',
                }}
                width={130}
                height={130}
                type={PicUploadTypes.Profile}
                initial={this.props.contact.image}
                onSuccess={(image: Image) => {
                  this.setState({ image });
                }}
                onDelete={() => {
                  this.setState({ image: null });
                }}
                segmentOnPressLog={() => {
                  Segment.track('Edit Contact - Click on Upload Image');
                }}
                segmentSuccessLog={() => {
                  Segment.track('Edit Contact - Upload Image Success');
                }}
                segmentErrorLogEvent="Edit Contact - Upload Image Error"
              />
            </View>
            <Text
              style={[
                Typography.FONT_BOLD,
                {
                  fontSize: 14,
                  paddingBottom: 4,
                },
              ]}
            >
              {i18n.t('UpdateContactScreen.firstName')}
            </Text>
            <Input
              ref={this.firstName}
              placeholder={i18n.t('UpdateContactScreen.firstName')}
              required
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
              nextInput={this.lastName}
            />
            <Text style={[Typography.FONT_BOLD, Styles.baseText]}>
              {i18n.t('UpdateContactScreen.lastName')}
            </Text>
            <Input
              ref={this.lastName}
              placeholder={i18n.t('UpdateContactScreen.lastName')}
              required
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
              nextInput={this.facilityName}
            />
            <Text style={[Typography.FONT_BOLD, Styles.baseText]}>
              {i18n.t('UpdateContactScreen.facilityName')}
            </Text>
            <Input
              ref={this.facilityName}
              placeholder={i18n.t('UpdateContactScreen.facilityName')}
              required
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
              nextInput={this.facilityAddress}
            />
            <Text style={[Typography.FONT_BOLD, Styles.baseText]}>
              {i18n.t('UpdateContactScreen.facilityAddress')}
            </Text>
            <Input
              ref={this.facilityAddress}
              placeholder={i18n.t('UpdateContactScreen.facilityAddress')}
              required
              validate={Validation.Address}
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
            />
            <Text style={[Typography.FONT_BOLD, Styles.baseText]}>
              {i18n.t('UpdateContactScreen.facilityCity')}
            </Text>
            <Input
              ref={this.facilityCity}
              placeholder={i18n.t('UpdateContactScreen.facilityCity')}
              required
              validate={Validation.City}
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
            />
            <Text style={[Typography.FONT_BOLD, Styles.baseText]}>
              {i18n.t('UpdateContactScreen.facilityState')}
            </Text>
            <Input
              ref={this.facilityState}
              placeholder={i18n.t('UpdateContactScreen.facilityState')}
              required
              validate={Validation.State}
              options={STATES_DROPDOWN}
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
            />
            <Text
              style={[
                Typography.FONT_BOLD,
                Styles.baseText,
                { paddingTop: 12 },
              ]}
            >
              {i18n.t('UpdateContactScreen.facilityPostal')}
            </Text>
            <Input
              ref={this.facilityPostal}
              placeholder={i18n.t('UpdateContactScreen.facilityPostal')}
              required
              validate={Validation.Postal}
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
            />
            <Text style={[Typography.FONT_BOLD, Styles.baseText]}>
              {i18n.t('UpdateContactScreen.facilityPhone')}
            </Text>
            <Input
              ref={this.facilityPhone}
              placeholder={i18n.t('UpdateContactScreen.facilityPhone')}
              validate={Validation.Phone}
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
            />
            <Text
              style={[
                Typography.FONT_BOLD,
                Styles.baseText,
                { color: Colors.GRAY_500 },
              ]}
            >
              {i18n.t('UpdateContactScreen.optionalUnit')}
            </Text>
            <Input
              ref={this.unit}
              placeholder={i18n.t('UpdateContactScreen.optionalUnit')}
            />
            <Text
              style={[
                Typography.FONT_BOLD,
                Styles.baseText,
                { color: Colors.GRAY_500 },
              ]}
            >
              {i18n.t('UpdateContactScreen.optionalDorm')}
            </Text>
            <Input
              ref={this.dorm}
              placeholder={i18n.t('UpdateContactScreen.optionalDorm')}
            />
            <Button
              buttonText={i18n.t('UpdateContactScreen.deleteProfile')}
              containerStyle={Styles.deleteButton}
              onPress={() => {
                popupAlert({
                  title: i18n.t('UpdateContactScreen.areYouSure'),
                  message: `${i18n.t('UpdateContactScreen.deleteWarning1')} ${
                    this.props.contact.firstName
                  } ${i18n.t('UpdateContactScreen.deleteWarning2')}.`,
                  buttons: [
                    {
                      text: i18n.t('UpdateContactScreen.deleteContact'),
                      onPress: this.doDeleteContact,
                      containerStyle: {
                        width: '100%',
                        backgroundColor: Colors.BLUE_500,
                      },
                    },
                    {
                      text: i18n.t('UpdateContactScreen.dontDelete'),
                      reverse: true,
                      textStyle: { color: Colors.BLUE_500 },
                      containerStyle: {
                        width: '100%',
                        borderColor: Colors.BLUE_500,
                      },
                    },
                  ],
                });
              }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    contact: state.contact.active,
  };
};

const UpdateContactScreen = connect(mapStateToProps)(UpdateContactScreenBase);

export default UpdateContactScreen;
