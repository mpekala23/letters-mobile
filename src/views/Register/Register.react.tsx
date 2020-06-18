import React, { createRef } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
  Platform,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigations';
import { Button, Input, PicUpload } from '@components';
import { Typography } from '@styles';
import { register } from '@api';
import { UserRegisterInfo } from '@store/User/UserTypes';
import { dropdownError } from 'components/Dropdown/Dropdown.react';
import { STATES_DROPDOWN, Validation } from '@utils';
import { CheckBox } from 'react-native-elements';
import i18n from '@i18n';
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
  registered: boolean;
  remember: boolean;
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

  constructor(props: Props) {
    super(props);
    this.state = {
      valid: false,
      registered: false,
      remember: false,
    };
  }

  devSkip = () => {
    if (this.firstName.current) this.firstName.current.set('Team');
    if (this.lastName.current) this.lastName.current.set('Ameelio');
    if (this.phone.current) this.phone.current.set('4324324432');
    if (this.address1.current) this.address1.current.set('Somewhere');
    if (this.country.current) this.country.current.set('USA');
    if (this.postal.current) this.postal.current.set('12345');
    if (this.city.current) this.city.current.set('New Haven');
    if (this.phyState.current) this.phyState.current.set('Conneticut');
    if (this.email.current) this.email.current.set('team@ameelio.org');
    if (this.password.current) this.password.current.set('ThisGood1');
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
      this.password.current
    ) {
      const result =
        this.firstName.current.state.valid &&
        this.lastName.current.state.valid &&
        this.phone.current.state.valid &&
        this.address1.current.state.valid &&
        this.country.current.state.valid &&
        this.postal.current.state.valid &&
        this.city.current.state.valid &&
        // this.phyState.current.state.valid &&
        this.email.current.state.valid &&
        this.password.current.state.valid;
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
      this.password.current
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
        remember: this.state.remember,
      };
      try {
        const res = await register(data);
      } catch (err) {
        if (err.message === 'Email in use') {
          Alert.alert(i18n.t('RegisterScreen.emailAlreadyInUse'));
        } else if (err.message === 'timeout') {
          dropdownError(
            i18n.t('Error.network'),
            i18n.t('Error.requestTimedOut')
          );
        } else {
          dropdownError(
            i18n.t('Error.network'),
            i18n.t('Error.requestIncomplete')
          );
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
            <PicUpload />
            <Text style={[Typography.FONT_ITALIC, { marginTop: 5 }]}>
              {i18n.t('RegisterScreen.clickToUploadProfileImage')}
            </Text>
          </View>
          <View style={Styles.privacyBackground}>
            <Text style={[Typography.FONT_BOLD, Styles.privacyText]}>
              {i18n.t('RegisterScreen.privacyText')}
            </Text>
          </View>
          <Button
            link
            buttonText={i18n.t('RegisterScreen.alreadyHaveAnAccount')}
            containerStyle={{ marginBottom: 10 }}
            onPress={() => {
              this.props.navigation.navigate('Login');
            }}
          />
          <Button buttonText="Dev Skip" onPress={this.devSkip} />
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
            parentStyle={Styles.fullWidth}
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
          <CheckBox
            checkedIcon={<Text>X</Text>}
            uncheckedIcon={<Text>O</Text>}
            center
            title="Remember Me"
            containerStyle={{
              backgroundColor: 'white',
              width: '50%',
              borderWidth: 0,
            }}
            checked={this.state.remember}
            onPress={() => {
              this.setState({ remember: !this.state.remember });
            }}
          />
          <Button
            containerStyle={Styles.fullWidth}
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
