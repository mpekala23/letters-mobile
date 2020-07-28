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
import { UserState, User } from '@store/User/UserTypes';
import { Photo } from 'types';
import { Colors, Typography } from '@styles';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { logout, updateProfile } from '@api';
import i18n from '@i18n';
import { PicUploadTypes } from '@components/PicUpload/PicUpload.react';
import { format } from 'date-fns';
import { STATES_DROPDOWN, Validation } from '@utils';
import * as Segment from 'expo-analytics-segment';
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
  image: Photo | null;
}

class UpdateProfileScreenBase extends React.Component<Props, State> {
  private firstName = createRef<Input>();

  private lastName = createRef<Input>();

  private phone = createRef<Input>();

  private address1 = createRef<Input>();

  private address2 = createRef<Input>();

  private postal = createRef<Input>();

  private city = createRef<Input>();

  private phyState = createRef<Input>();

  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      image: props.userState.user.photo ? props.userState.user.photo : null,
    };

    this.loadValuesFromStore = this.loadValuesFromStore.bind(this);
    this.updateValid = this.updateValid.bind(this);
    this.doUpdateProfile = this.doUpdateProfile.bind(this);
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
      blocking: true,
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
      blocking: true,
    });
  }

  doUpdateProfile = async () => {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.phone.current &&
      this.address1.current &&
      this.address2.current &&
      this.postal.current &&
      this.city.current &&
      this.phyState.current
    ) {
      const user: User = {
        id: this.props.userState.user.id,
        firstName: this.firstName.current.state.value,
        lastName: this.lastName.current.state.value,
        email: this.props.userState.user.email,
        phone: this.phone.current.state.value,
        address1: this.address1.current.state.value,
        address2: this.address2.current.state.value,
        postal: this.postal.current.state.value,
        city: this.city.current.state.value,
        state: this.phyState.current.state.value,
        photo: this.state.image ? this.state.image : undefined,
        credit: this.props.userState.user.credit,
        joined: this.props.userState.user.joined,
      };
      try {
        await updateProfile(user);
        Segment.track('Edit Profile - Click on Save');
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
      this.phone.current &&
      this.address1.current &&
      this.address2.current &&
      this.postal.current &&
      this.city.current &&
      this.phyState.current
    ) {
      this.firstName.current.set(this.props.userState.user.firstName);
      this.lastName.current.set(this.props.userState.user.lastName);
      this.phone.current.set(this.props.userState.user.phone);
      this.address1.current.set(this.props.userState.user.address1);
      this.address2.current.set(
        this.props.userState.user.address2
          ? this.props.userState.user.address2
          : ''
      );
      this.postal.current.set(this.props.userState.user.postal);
      this.city.current.set(this.props.userState.user.city);
      this.phyState.current.set(this.props.userState.user.state);
    }
  }

  updateValid() {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.phone.current &&
      this.address1.current &&
      this.postal.current &&
      this.city.current &&
      this.phyState.current
    ) {
      const result =
        this.firstName.current.state.valid &&
        this.lastName.current.state.valid &&
        this.phone.current.state.valid &&
        this.address1.current.state.valid &&
        this.postal.current.state.valid &&
        this.city.current.state.valid &&
        this.phyState.current.state.valid;
      this.setValid(result);
    }
  }

  render() {
    const { user } = this.props.userState;
    const joinedDate = format(this.props.userState.user.joined, 'MMM dd, yyyy');
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'white',
          paddingHorizontal: 16,
        }}
        onPress={() => Keyboard.dismiss()}
        activeOpacity={1.0}
      >
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : -200}
          enabled
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            scrollEnabled
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingVertical: 24 }}
          >
            <View style={Styles.profileCard}>
              <PicUpload
                shapeBackground={{ borderWidth: 6, borderColor: 'white' }}
                width={130}
                height={130}
                type={PicUploadTypes.Profile}
                initial={this.props.userState.user.photo}
                onSuccess={(image: Photo) => this.setState({ image })}
                onDelete={() => this.setState({ image: null })}
                segmentOnPressLog={() => {
                  Segment.track('Edit Profile - Click on Upload Image');
                }}
                segmentSuccessLog={() => {
                  Segment.track('Edit Profile - Upload Image Success');
                }}
                segmentErrorLogEvent="Edit Profile - Upload Image Error"
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
                {i18n.t('UpdateProfileScreen.joined')} {joinedDate}
              </Text>
            </View>
            <Text style={[Typography.FONT_BOLD, Styles.baseText]}>
              {i18n.t('UpdateProfileScreen.firstName')}
            </Text>
            <Input
              ref={this.firstName}
              parentStyle={Styles.parentStyle}
              placeholder={i18n.t('UpdateProfileScreen.firstName')}
              required
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
              nextInput={this.lastName}
            />
            <Text style={[Typography.FONT_BOLD, Styles.baseText]}>
              {i18n.t('UpdateProfileScreen.lastName')}
            </Text>
            <Input
              ref={this.lastName}
              parentStyle={Styles.parentStyle}
              placeholder={i18n.t('UpdateProfileScreen.lastName')}
              required
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
              nextInput={this.phone}
            />
            <Text style={[Typography.FONT_BOLD, Styles.baseText]}>
              {i18n.t('UpdateProfileScreen.cellPhone')}
            </Text>
            <Input
              ref={this.phone}
              parentStyle={Styles.parentStyle}
              placeholder={i18n.t('UpdateProfileScreen.cellPhone')}
              required
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
              nextInput={this.address1}
            />
            <Text style={[Typography.FONT_BOLD, Styles.baseText]}>
              {i18n.t('UpdateProfileScreen.addressLine1')}
            </Text>
            <Input
              ref={this.address1}
              parentStyle={Styles.parentStyle}
              placeholder={i18n.t('UpdateProfileScreen.addressLine1')}
              required
              validate={Validation.Address}
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
              nextInput={this.address2}
            />
            <Text style={[Typography.FONT_BOLD, Styles.baseText]}>
              {i18n.t('UpdateProfileScreen.addressLine2')}
            </Text>
            <Input
              ref={this.address2}
              parentStyle={Styles.parentStyle}
              placeholder={i18n.t('UpdateProfileScreen.addressLine2')}
              validate={Validation.Address}
              onValid={this.updateValid}
              nextInput={this.city}
            />
            <Text style={[Typography.FONT_BOLD, Styles.baseText]}>
              {i18n.t('UpdateProfileScreen.city')}
            </Text>
            <Input
              ref={this.city}
              parentStyle={Styles.parentStyle}
              placeholder={i18n.t('UpdateProfileScreen.city')}
              required
              validate={Validation.City}
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
              nextInput={this.phyState}
            />
            <Text style={[Typography.FONT_BOLD, Styles.baseText]}>
              {i18n.t('UpdateProfileScreen.state')}
            </Text>
            <Input
              ref={this.phyState}
              parentStyle={Styles.parentStyle}
              placeholder={i18n.t('UpdateProfileScreen.state')}
              required
              validate={Validation.State}
              options={STATES_DROPDOWN}
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
              nextInput={this.postal}
            />
            <Text style={[Typography.FONT_BOLD, Styles.baseText]}>
              {i18n.t('UpdateProfileScreen.zipcode')}
            </Text>
            <Input
              ref={this.postal}
              placeholder={i18n.t('UpdateProfileScreen.zipcode')}
              required
              validate={Validation.Postal}
              onValid={this.updateValid}
              onInvalid={() => this.setValid(false)}
            />
            <Button
              buttonText={i18n.t('UpdateProfileScreen.logOut')}
              onPress={() => {
                Segment.track('Logout');
                logout();
              }}
              containerStyle={Styles.logOutButton}
            />
          </ScrollView>
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
