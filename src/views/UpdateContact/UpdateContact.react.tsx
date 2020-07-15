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
import { Contact } from '@store/Contact/ContactTypes';
import { Facility, Photo } from 'types';
import { Typography, Colors } from '@styles';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { updateContact, deleteContact } from '@api';
import i18n from '@i18n';
import { LinearGradient } from 'expo-linear-gradient';
import { PicUploadTypes } from '@components/PicUpload/PicUpload.react';
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
  image: Photo | null;
}

class UpdateContactScreenBase extends React.Component<Props, State> {
  private firstName = createRef<Input>();

  private lastName = createRef<Input>();

  private facilityName = createRef<Input>();

  private facilityAddress = createRef<Input>();

  private unit = createRef<Input>();

  private dorm = createRef<Input>();

  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      image: props.contact.photo ? props.contact.photo : null,
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
    });
  }

  doDeleteContact = async () => {
    try {
      await deleteContact(this.props.contact.id);
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
      this.props.contact.facility
    ) {
      const facility: Facility = {
        name: this.facilityName.current.state.value,
        type: this.props.contact.facility.type,
        address: this.facilityAddress.current.state.value,
        city: this.props.contact.facility.city,
        state: this.props.contact.facility.state,
        postal: this.props.contact.facility.postal,
      };
      const contact: Contact = {
        id: this.props.contact.id,
        firstName: this.firstName.current.state.value,
        lastName: this.lastName.current.state.value,
        inmateNumber: this.props.contact.inmateNumber,
        relationship: this.props.contact.relationship,
        facility,
        photo: this.state.image ? this.state.image : undefined,
      };
      try {
        await updateContact(contact);
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
      this.props.contact.facility
    ) {
      this.firstName.current.set(this.props.contact.firstName);
      this.lastName.current.set(this.props.contact.lastName);
      this.facilityName.current.set(this.props.contact.facility.name);
      this.facilityAddress.current.set(this.props.contact.facility.address);
    }
  }

  updateValid() {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.facilityName.current &&
      this.facilityAddress.current &&
      this.props.contact.facility
    ) {
      const result =
        this.firstName.current.state.valid &&
        this.lastName.current.state.valid &&
        this.facilityName.current.state.valid &&
        this.facilityAddress.current.state.valid;
      this.setValid(result);
    }
  }

  render() {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'white',
          padding: 16,
        }}
        onPress={() => Keyboard.dismiss()}
        activeOpacity={1.0}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          enabled
        />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          scrollEnabled
          style={{ width: '100%' }}
        >
          <View style={Styles.profileCard}>
            <LinearGradient
              colors={['#ADD3FF', '#FFC9C9']}
              style={Styles.profileCardHeader}
              start={{ x: 0, y: 1 }}
              end={{ x: 1, y: 0 }}
            />
            <PicUpload
              shapeBackground={{ borderWidth: 6, borderColor: 'white' }}
              width={130}
              height={130}
              type={PicUploadTypes.Profile}
              initial={this.props.contact.photo}
              onSuccess={(image: Photo) => this.setState({ image })}
              onDelete={() => this.setState({ image: null })}
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
          <Text
            style={[
              Typography.FONT_BOLD,
              {
                fontSize: 14,
                paddingBottom: 4,
              },
            ]}
          >
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
          <Text
            style={[
              Typography.FONT_BOLD,
              {
                fontSize: 14,
                paddingBottom: 4,
              },
            ]}
          >
            {i18n.t('UpdateContactScreen.addressLine1')}
          </Text>
          <Input
            ref={this.facilityName}
            placeholder={i18n.t('UpdateContactScreen.addressLine1')}
            required
            onValid={this.updateValid}
            onInvalid={() => this.setValid(false)}
            nextInput={this.facilityAddress}
          />
          <Text
            style={[
              Typography.FONT_BOLD,
              {
                fontSize: 14,
                paddingBottom: 4,
              },
            ]}
          >
            {i18n.t('UpdateContactScreen.addressLine2')}
          </Text>
          <Input
            ref={this.facilityAddress}
            placeholder={i18n.t('UpdateContactScreen.addressLine2')}
            required
            onValid={this.updateValid}
            onInvalid={() => this.setValid(false)}
          />

          <Input
            ref={this.unit}
            placeholder={i18n.t('UpdateContactScreen.optionalUnit')}
          />
          <Input
            ref={this.dorm}
            placeholder={i18n.t('UpdateContactScreen.optionalDorm')}
          />
        </ScrollView>
        <Button
          buttonText={i18n.t('UpdateContactScreen.deleteProfile')}
          containerStyle={{ backgroundColor: Colors.BLUE_DARKEST }}
          onPress={() => {
            popupAlert({
              title: i18n.t('UpdateContactScreen.areYouSure'),
              message: `${i18n.t('UpdateContactScreen.deleteWarning1')} ${
                contact.firstName
              } ${i18n.t('UpdateContactScreen.deleteWarning2')}.`,
              buttons: [
                {
                  text: i18n.t('UpdateContactScreen.deleteContact'),
                  onPress: this.doDeleteContact,
                  containerStyle: {
                    width: '100%',
                    backgroundColor: Colors.BLUE_DARKEST,
                  },
                },
                {
                  text: i18n.t('UpdateContactScreen.dontDelete'),
                  reverse: true,
                  textStyle: { color: Colors.BLUE_DARKEST },
                  containerStyle: {
                    width: '100%',
                    borderColor: Colors.BLUE_DARKEST,
                  },
                },
              ],
            });
          }}
        />
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
