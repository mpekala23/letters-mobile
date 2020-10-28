import React, { createRef, Dispatch } from 'react';
import {
  Text,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native';
import {
  Button,
  Input,
  PicUpload,
  KeyboardAvoider,
  Picker,
  PickerRef,
} from '@components';
import { AppStackParamList } from '@utils/Screens';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { Facility, Image, Contact, TopbarRight } from 'types';
import { Typography, Colors } from '@styles';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { updateContact, deleteContact } from '@api';
import i18n from '@i18n';
import { LinearGradient } from 'expo-linear-gradient';
import { PicUploadTypes } from '@components/PicUpload/PicUpload.react';
import { popupAlert } from '@components/Alert/Alert.react';
import { Validation, STATES_DROPDOWN } from '@utils';
import * as Segment from 'expo-analytics-segment';
import { UIActionTypes } from '@store/UI/UITypes';
import { setTopbarRight } from '@store/UI/UIActions';
import Styles from './UpdateContact.styles';

type UpdateContactScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'UpdateContact'
>;

export interface Props {
  navigation: UpdateContactScreenNavigationProp;
  contact: Contact;
  setTopbarRight: (details: TopbarRight | null) => void;
}

export interface State {
  image: Image | null;
}

class UpdateContactScreenBase extends React.Component<Props, State> {
  private firstName = createRef<Input>();

  private lastName = createRef<Input>();

  private inmateNumber = createRef<Input>();

  private facilityName = createRef<Input>();

  private facilityAddress = createRef<Input>();

  private facilityCity = createRef<Input>();

  private facilityStatePicker = createRef<PickerRef>();

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
    this.props.setTopbarRight({
      enabled: true,
      text: i18n.t('UpdateContactScreen.save'),
      action: this.doUpdateContact,
      blocking: true,
    });
  }

  onNavigationBlur = () => {
    this.props.setTopbarRight(null);
  };

  setValid(val: boolean) {
    this.props.setTopbarRight({
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
      this.inmateNumber.current &&
      this.facilityName.current &&
      this.facilityAddress.current &&
      this.facilityCity.current &&
      this.facilityStatePicker.current &&
      this.facilityPostal.current &&
      this.facilityPhone.current &&
      this.props.contact.facility
    ) {
      const facility: Facility = {
        name: this.facilityName.current.state.value,
        type: this.props.contact.facility.type,
        address: this.facilityAddress.current.state.value,
        city: this.facilityCity.current.state.value,
        state: this.facilityStatePicker.current.value,
        postal: this.facilityPostal.current.state.value,
        phone: this.facilityPhone.current.state.value,
      };
      const contact: Contact = {
        ...this.props.contact,
        id: this.props.contact.id,
        firstName: this.firstName.current.state.value,
        lastName: this.lastName.current.state.value,
        inmateNumber: this.inmateNumber.current.state.value,
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
      this.inmateNumber.current &&
      this.facilityName.current &&
      this.facilityAddress.current &&
      this.facilityCity.current &&
      this.facilityStatePicker.current &&
      this.facilityPostal.current &&
      this.facilityPhone.current &&
      this.unit.current &&
      this.dorm.current &&
      this.props.contact.facility
    ) {
      this.firstName.current.set(this.props.contact.firstName);
      this.lastName.current.set(this.props.contact.lastName);
      this.inmateNumber.current.set(this.props.contact.inmateNumber);
      this.facilityName.current.set(this.props.contact.facility.name);
      this.facilityAddress.current.set(this.props.contact.facility.address);
      this.facilityCity.current.set(this.props.contact.facility.city);
      this.facilityStatePicker.current.setStoredValue(
        this.props.contact.facility.state
      );
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
      this.inmateNumber.current &&
      this.facilityName.current &&
      this.facilityAddress.current &&
      this.facilityPhone.current &&
      this.props.contact.facility
    ) {
      const result =
        this.firstName.current.state.valid &&
        this.lastName.current.state.valid &&
        this.inmateNumber.current.state.valid &&
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
        <KeyboardAvoider
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            paddingHorizontal: 16,
          }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            scrollEnabled
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingVertical: 16 }}
          >
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1.0}>
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
              <Text style={[Typography.FONT_SEMIBOLD, Styles.baseText]}>
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
              <Text style={[Typography.FONT_SEMIBOLD, Styles.baseText]}>
                {i18n.t('UpdateContactScreen.lastName')}
              </Text>
              <Input
                ref={this.lastName}
                placeholder={i18n.t('UpdateContactScreen.lastName')}
                required
                onValid={this.updateValid}
                onInvalid={() => this.setValid(false)}
                nextInput={this.inmateNumber}
              />
              <Text style={[Typography.FONT_SEMIBOLD, Styles.baseText]}>
                {i18n.t('UpdateContactScreen.inmateNumber')}
              </Text>
              <Input
                ref={this.inmateNumber}
                placeholder={i18n.t('UpdateContactScreen.inmateNumber')}
                required
                onValid={this.updateValid}
                onInvalid={() => this.setValid(false)}
                nextInput={this.facilityName}
              />
              <Text style={[Typography.FONT_SEMIBOLD, Styles.baseText]}>
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
              <Text style={[Typography.FONT_SEMIBOLD, Styles.baseText]}>
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
              <Text style={[Typography.FONT_SEMIBOLD, Styles.baseText]}>
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
              <Text style={[Typography.FONT_SEMIBOLD, Styles.baseText]}>
                {i18n.t('UpdateContactScreen.facilityState')}
              </Text>
              <Picker
                ref={this.facilityStatePicker}
                items={STATES_DROPDOWN}
                placeholder={i18n.t('UpdateContactScreen.facilityState')}
                onValueChange={() => {
                  this.updateValid();
                }}
              />
              <Text style={[Typography.FONT_SEMIBOLD, Styles.baseText]}>
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
              <Text style={[Typography.FONT_SEMIBOLD, Styles.baseText]}>
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
                  Typography.FONT_SEMIBOLD,
                  Styles.baseText,
                  { color: Colors.GRAY_400 },
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
                  Typography.FONT_SEMIBOLD,
                  Styles.baseText,
                  { color: Colors.GRAY_400 },
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
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoider>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  contact: state.contact.active,
});
const mapDispatchToProps = (dispatch: Dispatch<UIActionTypes>) => ({
  setTopbarRight: (details: TopbarRight | null) =>
    dispatch(setTopbarRight(details)),
});
const UpdateContactScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateContactScreenBase);

export default UpdateContactScreen;
