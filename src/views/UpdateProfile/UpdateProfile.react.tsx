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

  constructor(props: Props) {
    super(props);
    this.state = {
      inputting: false,
      valid: false,
    };
    this.updateValid = this.updateValid.bind(this);
    this.doUpdateProfile = this.doUpdateProfile.bind(this);
    this.didUpdateAtLeastOneField = this.didUpdateAtLeastOneField.bind(this);
  }

  componentDidMount() {
    this.onNavigationFocus();
  }

  onNavigationFocus() {
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
        // console.log("new user:", user);
        await updateProfile(user);
        // this.props.navigation.navigate('ContactSelector');
      } catch (err) {
        dropdownError(
          i18n.t('Error.network'),
          i18n.t('Error.requestIncomplete')
        );
      }
    }
  };

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
      this.setState({ valid: result });
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
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                position: 'absolute',
                top: 0,
                right: 0,
              }}
            >
              <Button
                buttonText={i18n.t('UpdateProfileScreen.save')}
                onPress={this.doUpdateProfile}
                enabled={this.state.valid}
                containerStyle={Styles.saveButton}
              />
            </View>
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
            scrollEnabled={this.state.inputting}
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
              onFocus={() => {
                this.setState({ inputting: true });
              }}
              onBlur={() => {
                this.setState({ inputting: false });
              }}
              onValid={this.updateValid}
              onInvalid={() => this.setState({ valid: false })}
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
              onFocus={() => {
                this.setState({ inputting: true });
              }}
              onBlur={() => {
                this.setState({ inputting: false });
              }}
              onValid={this.updateValid}
              onInvalid={() => this.setState({ valid: false })}
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
              onFocus={() => {
                this.setState({ inputting: true });
              }}
              onBlur={() => {
                this.setState({ inputting: false });
              }}
              onValid={this.updateValid}
              onInvalid={() => this.setState({ valid: false })}
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
              onFocus={() => {
                this.setState({ inputting: true });
              }}
              onBlur={() => {
                this.setState({ inputting: false });
              }}
              onValid={this.updateValid}
              onInvalid={() => this.setState({ valid: false })}
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
