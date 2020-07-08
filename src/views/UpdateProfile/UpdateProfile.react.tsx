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
import { Button, Input, ProfilePic } from '@components';
import { setProfileOverride } from '@components/Topbar/Topbar.react';
import { AppStackParamList } from 'navigations';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { UserState } from '@store/User/UserTypes';
import { ProfilePicTypes } from 'types';
import { Colors, Typography } from '@styles';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { logout, updateProfile } from 'api';
import i18n from '@i18n';
import Styles from './UpdateProfile.styles';

type UpdateProfileScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'UpdateProfile'
>;

export interface Props {
  navigation: UpdateProfileScreenNavigationProp;
  userState: UserState;
}

export interface State {
  inputting: boolean;
  valid: boolean;
}

class UpdateProfileScreenBase extends React.Component<Props, State> {
  private firstName = createRef<Input>();

  private lastName = createRef<Input>();

  private phone = createRef<Input>();

  private address = createRef<Input>();

  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  constructor(props: Props) {
    super(props);
    this.loadValuesFromStore = this.loadValuesFromStore.bind(this);
    this.updateValid = this.updateValid.bind(this);
    this.doUpdateProfile = this.doUpdateProfile.bind(this);
    this.didUpdateAtLeastOneField = this.didUpdateAtLeastOneField.bind(this);
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
      text: i18n.t('UpdateProfileScreen.save'),
      action: this.doUpdateProfile,
    });
  }

  onNavigationBlur = () => {
    setProfileOverride(undefined);
  };

  setValid(val: boolean) {
    setProfileOverride({
      enabled: val,
      text: i18n.t('UpdateProfileScreen.save'),
      action: this.doUpdateProfile,
    });
  }

  doUpdateProfile = async () => {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.phone.current &&
      this.address.current
    ) {
      const user = {
        id: this.props.userState.user.id,
        first_name: this.firstName.current.state.value,
        last_name: this.lastName.current.state.value,
        email: this.props.userState.user.email,
        phone: this.phone.current.state.value,
        address1: this.address.current.state.value,
        address2: this.props.userState.user.address2,
        country: this.props.userState.user.country,
        postal: this.props.userState.user.postal,
        city: this.props.userState.user.city,
        state: this.props.userState.user.state,
        imageUri: this.props.userState.user.imageUri,
      };
      try {
        await updateProfile(user);
        this.props.navigation.pop();
      } catch (err) {
        dropdownError(
          i18n.t('Error.network'),
          i18n.t('Error.requestIncomplete')
        );
      }
    }
  };

  loadValuesFromStore() {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.phone.current &&
      this.address.current
    ) {
      this.firstName.current.set(this.props.userState.user.firstName);
      this.lastName.current.set(this.props.userState.user.lastName);
      this.phone.current.set(this.props.userState.user.phone);
      this.address.current.set(this.props.userState.user.address1);
    }
  }

  updateValid() {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.phone.current &&
      this.address.current
    ) {
      const result =
        this.firstName.current.state.valid &&
        this.lastName.current.state.valid &&
        this.phone.current.state.valid &&
        this.address.current.state.valid &&
        this.didUpdateAtLeastOneField();
      this.setValid(result);
    }
  }

  didUpdateAtLeastOneField() {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.phone.current &&
      this.address.current
    ) {
      return (
        this.firstName.current.state.value !==
          this.props.userState.user.firstName ||
        this.lastName.current.state.value !==
          this.props.userState.user.lastName ||
        this.phone.current.state.value !== this.props.userState.user.phone ||
        this.address.current.state.value !== this.props.userState.user.address1
      );
    }
    return false;
  }

  render() {
    const { user } = this.props.userState;
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
        >
          <View style={Styles.profileCard}>
            <ProfilePic
              firstName={user.firstName}
              lastName={user.lastName}
              imageUri="ExamplePic"
              type={ProfilePicTypes.SingleContact}
            />
            <Text style={[Typography.FONT_BOLD, { fontSize: 24 }]}>
              {user.firstName}
            </Text>
            <Text
              style={[
                Typography.FONT_MEDIUM,
                { color: Colors.GRAY_DARK, paddingBottom: 6 },
              ]}
            >
              {/* Add in user's joined date after API integration */}
              {i18n.t('UpdateProfileScreen.joined')}
            </Text>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            scrollEnabled
            style={{ width: '100%' }}
          >
            <Text
              style={[
                Typography.FONT_BOLD,
                {
                  fontSize: 14,
                  paddingBottom: 4,
                },
              ]}
            >
              {i18n.t('UpdateProfileScreen.firstName')}
            </Text>
            <Input
              ref={this.firstName}
              parentStyle={{ width: '100%' }}
              placeholder={i18n.t('UpdateProfileScreen.firstName')}
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
              {i18n.t('UpdateProfileScreen.lastName')}
            </Text>
            <Input
              ref={this.lastName}
              parentStyle={{ width: '100%', marginBottom: 10 }}
              placeholder={i18n.t('UpdateProfileScreen.lastName')}
              required
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
              nextInput={this.phone}
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
              {i18n.t('UpdateProfileScreen.cellPhone')}
            </Text>
            <Input
              ref={this.phone}
              parentStyle={{ width: '100%', marginBottom: 10 }}
              placeholder={i18n.t('UpdateProfileScreen.cellPhone')}
              required
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
              nextInput={this.address}
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
              {i18n.t('UpdateProfileScreen.addressLine')}
            </Text>
            <Input
              ref={this.address}
              placeholder={i18n.t('UpdateProfileScreen.addressLine')}
              required
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
            />
          </ScrollView>
          <Button
            buttonText={i18n.t('UpdateProfileScreen.logOut')}
            onPress={async () => logout()}
            containerStyle={Styles.logOutButton}
          />
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    userState: state.user,
  };
};

const UpdateProfileScreen = connect(mapStateToProps)(UpdateProfileScreenBase);

export default UpdateProfileScreen;
