import React, { createRef } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigations';
import { Button, Input, PicUpload } from '@components';
import { PicUploadTypes } from '@components/PicUpload/PicUpload.react';
import { Typography } from '@styles';
import { register } from '@api';
import { UserRegisterInfo } from '@store/User/UserTypes';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import {
  STATES_DROPDOWN,
  Validation,
  REFERERS,
  hoursTill8Tomorrow,
} from '@utils';
import { CheckBox } from 'react-native-elements';
import CheckedIcon from '@assets/views/Onboarding/Checked';
import UncheckedIcon from '@assets/views/Onboarding/Unchecked';
import Icon from '@components/Icon/Icon.react';
import i18n from '@i18n';
import { popupAlert } from '@components/Alert/Alert.react';
import { Photo } from 'types';
import Notifs from '@notifications';
import { NotifTypes } from '@store/Notif/NotifTypes';
import Styles from './Register.style';

type RegisterScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register'
>;

export interface Props {
  navigation: RegisterScreenNavigationProp;
}

export interface State {
  valid: boolean;
  remember: boolean;
  image: Photo | null;
}

class RegisterScreen extends React.Component<Props, State> {
  private firstName = createRef<Input>();

  private lastName = createRef<Input>();

  private phone = createRef<Input>();

  private address1 = createRef<Input>();

  private address2 = createRef<Input>();

  private country = createRef<Input>();

  private postal = createRef<Input>();

  private city = createRef<Input>();

  private phyState = createRef<Input>();

  private email = createRef<Input>();

  private password = createRef<Input>();

  private passwordConfirmation = createRef<Input>();

  private referer = createRef<Input>();

  constructor(props: Props) {
    super(props);
    this.state = {
      valid: false,
      remember: false,
      image: null,
    };
  }

  devSkip = (): void => {
    if (this.firstName.current) this.firstName.current.set('Team');
    if (this.lastName.current) this.lastName.current.set('Ameelio');
    if (this.phone.current) this.phone.current.set('4324324432');
    if (this.address1.current) this.address1.current.set('Somewhere');
    if (this.country.current) this.country.current.set('USA');
    if (this.postal.current) this.postal.current.set('12345');
    if (this.city.current) this.city.current.set('New Haven');
    if (this.phyState.current) this.phyState.current.set('Connecticut');
    if (this.email.current) this.email.current.set('team@ameelio.org');
    if (this.password.current) this.password.current.set('ThisGood1');
    if (this.passwordConfirmation.current)
      this.passwordConfirmation.current.set('ThisGood1');
    if (this.referer.current) this.referer.current.set('Other');
    this.updateValid();
  };

  updateValid = (): void => {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.phone.current &&
      this.address1.current &&
      this.country.current &&
      this.postal.current &&
      this.city.current &&
      this.phyState.current &&
      this.email.current &&
      this.password.current &&
      this.passwordConfirmation.current &&
      this.referer.current
    ) {
      const result =
        this.firstName.current.state.valid &&
        this.lastName.current.state.valid &&
        this.phone.current.state.valid &&
        this.address1.current.state.valid &&
        this.country.current.state.valid &&
        this.postal.current.state.valid &&
        this.city.current.state.valid &&
        this.phyState.current.state.valid &&
        this.email.current.state.valid &&
        this.password.current.state.valid &&
        this.passwordConfirmation.current.state.value ===
          this.password.current.state.value &&
        this.referer.current.state.valid;
      this.setState({ valid: result });
    }
  };

  doRegister = async (): Promise<void> => {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.phone.current &&
      this.address1.current &&
      this.address2.current &&
      this.country.current &&
      this.postal.current &&
      this.city.current &&
      this.phyState.current &&
      this.email.current &&
      this.password.current &&
      this.passwordConfirmation.current &&
      this.referer.current
    ) {
      const data: UserRegisterInfo = {
        firstName: this.firstName.current.state.value,
        lastName: this.lastName.current.state.value,
        phone: this.phone.current.state.value,
        address1: this.address1.current.state.value,
        address2: this.address2.current.state.value,
        country: this.country.current.state.value,
        postal: this.postal.current.state.value,
        city: this.city.current.state.value,
        state: this.phyState.current.state.value,
        email: this.email.current.state.value,
        password: this.password.current.state.value,
        passwordConfirmation: this.passwordConfirmation.current.state.value,
        remember: this.state.remember,
        referer: this.referer.current.state.value,
        photo: this.state.image ? this.state.image : undefined,
      };
      try {
        await register(data);
        Notifs.scheduleNotificationInHours(
          {
            title: `${i18n.t('Notifs.youreOneTapAway')}`,
            body: `${i18n.t('Notifs.clickHereToBegin')}`,
            data: {
              type: NotifTypes.NoFirstContact,
              screen: 'ContactSelector',
            },
          },
          hoursTill8Tomorrow()
        );
      } catch (err) {
        if (err.data && err.data.email) {
          popupAlert({
            title: i18n.t('RegisterScreen.emailAlreadyInUse'),
            buttons: [
              {
                text: i18n.t('RegisterScreen.login'),
                onPress: () => this.props.navigation.replace('Login'),
              },
              {
                text: i18n.t('Alert.okay'),
                reverse: true,
              },
            ],
          });
        } else if (err.message === 'timeout') {
          dropdownError({ message: i18n.t('Error.requestTimedOut') });
        } else {
          dropdownError({ message: i18n.t('Error.requestIncomplete') });
        }
      }
    }
  };

  render(): JSX.Element {
    return (
      <KeyboardAvoidingView
        style={Styles.trueBackground}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        enabled
      >
        <ScrollView
          style={Styles.backgroundScroll}
          contentContainerStyle={Styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View
            accessible
            accessibilityLabel="Tap to upload profile image"
            style={Styles.picContainer}
          >
            <PicUpload
              shapeBackground={{ borderWidth: 6, borderColor: 'white' }}
              width={130}
              height={130}
              type={PicUploadTypes.Profile}
              onSuccess={(image: Photo) => this.setState({ image })}
              onDelete={() => this.setState({ image: null })}
            />
            <Text style={[Typography.FONT_REGULAR_ITALIC, { marginTop: 5 }]}>
              {i18n.t('RegisterScreen.clickToUploadProfileImage')}
            </Text>
          </View>
          <Button
            link
            buttonText={i18n.t('RegisterScreen.alreadyHaveAnAccount')}
            containerStyle={{ marginBottom: 20 }}
            onPress={() => {
              this.props.navigation.navigate('Login');
            }}
          />
          <Input
            ref={this.firstName}
            parentStyle={Styles.fullWidth}
            placeholder={i18n.t('RegisterScreen.firstName')}
            required
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
            nextInput={this.lastName}
          />
          <Input
            ref={this.lastName}
            parentStyle={Styles.fullWidth}
            placeholder={i18n.t('RegisterScreen.lastName')}
            required
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
            nextInput={this.phone}
          />
          <View style={{ flexDirection: 'row' }}>
            <Input
              ref={this.phone}
              parentStyle={Styles.fullWidth}
              placeholder={i18n.t('RegisterScreen.cellphoneNumber')}
              required
              validate={Validation.Phone}
              onValid={this.updateValid}
              onInvalid={() => this.setState({ valid: false })}
              nextInput={this.address1}
            />
          </View>
          <Input
            ref={this.address1}
            parentStyle={Styles.fullWidth}
            placeholder={i18n.t('RegisterScreen.addressLine1')}
            required
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
            nextInput={this.address2}
          />
          <Input
            ref={this.address2}
            parentStyle={Styles.fullWidth}
            placeholder={i18n.t('RegisterScreen.addressLine2')}
            nextInput={this.country}
          />
          <Input
            ref={this.country}
            parentStyle={Styles.fullWidth}
            placeholder={i18n.t('RegisterScreen.country')}
            required
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
            nextInput={this.postal}
          />
          <Input
            ref={this.postal}
            parentStyle={Styles.fullWidth}
            placeholder={i18n.t('RegisterScreen.zipcode')}
            required
            validate={Validation.Postal}
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
            nextInput={this.city}
          />
          <Input
            ref={this.city}
            parentStyle={Styles.fullWidth}
            placeholder={i18n.t('RegisterScreen.city')}
            required
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
            nextInput={this.phyState}
          />
          <Input
            ref={this.phyState}
            parentStyle={[Styles.fullWidth, { marginBottom: 8 }]}
            placeholder={i18n.t('RegisterScreen.state')}
            validate={Validation.State}
            options={STATES_DROPDOWN}
            required
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
            nextInput={this.email}
          />
          <Input
            ref={this.email}
            parentStyle={Styles.fullWidth}
            placeholder={i18n.t('RegisterScreen.emailAddress')}
            required
            validate={Validation.Email}
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
            nextInput={this.password}
          />
          <Input
            ref={this.password}
            parentStyle={Styles.fullWidth}
            placeholder={i18n.t('RegisterScreen.password')}
            required
            secure
            validate={Validation.Password}
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
          />
          <Input
            ref={this.passwordConfirmation}
            parentStyle={Styles.fullWidth}
            placeholder={i18n.t('RegisterScreen.confirmPassword')}
            required
            secure
            validate={Validation.Password}
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
          />
          <Input
            ref={this.referer}
            parentStyle={Styles.fullWidth}
            placeholder={i18n.t('RegisterScreen.referer')}
            required
            options={REFERERS}
            onValid={this.updateValid}
            onInvalid={() => this.setState({ valid: false })}
          />
          <CheckBox
            checkedIcon={<Icon svg={CheckedIcon} />}
            uncheckedIcon={<Icon svg={UncheckedIcon} />}
            center
            title="Remember Me"
            containerStyle={{
              backgroundColor: 'white',
              width: '50%',
              borderWidth: 0,
            }}
            checked={this.state.remember}
            onPress={() => {
              this.setState((prevState) => {
                return { ...prevState, remember: !prevState.remember };
              });
            }}
          />
          {null && <Button buttonText="Dev Skip" onPress={this.devSkip} />}
          <Button
            containerStyle={[Styles.fullWidth, Styles.registerButton]}
            buttonText={i18n.t('RegisterScreen.register')}
            enabled={this.state.valid}
            onPress={this.doRegister}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default RegisterScreen;
