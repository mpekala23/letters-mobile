import React, { createRef } from 'react';
import {
  ScrollView,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList, Screens } from '@utils/Screens';
import { login } from '@api';
import { Button, Input, KeyboardAvoider } from '@components';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { Typography } from '@styles';
import { UserLoginInfo } from '@store/User/UserTypes';
import CheckedIcon from '@assets/views/Onboarding/Checked';
import UncheckedIcon from '@assets/views/Onboarding/Unchecked';
import Icon from '@components/Icon/Icon.react';
import i18n from '@i18n';
import { popupAlert } from '@components/Alert/Alert.react';
import * as Segment from 'expo-analytics-segment';
import Styles from './Login.styles';

type LoginScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Login'
>;

export interface Props {
  navigation: LoginScreenNavigationProp;
}

export interface State {
  remember: boolean;
}

class LoginScreen extends React.Component<Props, State> {
  private emailRef = createRef<Input>();

  private passwordRef = createRef<Input>();

  constructor(props: Props) {
    super(props);
    this.state = {
      remember: true,
    };
    this.emailRef = createRef();
    this.passwordRef = createRef();
  }

  devSkip = async (): Promise<void> => {
    if (this.emailRef.current) this.emailRef.current.set('team@ameelio.org');
    if (this.passwordRef.current) this.passwordRef.current.set('ThisGood1');
    setTimeout(() => {
      this.onLogin();
    }, 10);
  };

  onLogin = async (): Promise<void> => {
    Keyboard.dismiss();
    if (this.emailRef.current && this.passwordRef.current) {
      const cred: UserLoginInfo = {
        email: this.emailRef.current && this.emailRef.current.state.value,
        password:
          this.passwordRef.current && this.passwordRef.current.state.value,
        remember: true,
      };
      if (cred.email.length <= 0 || cred.password.length <= 0) {
        popupAlert({
          title: i18n.t('LoginScreen.emailAndPasswordRequired'),
          buttons: [
            {
              text: i18n.t('Alert.okay'),
            },
          ],
        });
        return;
      }
      try {
        await login(cred);
      } catch (err) {
        if (err.message === 'Invalid Email') {
          dropdownError({
            message: i18n.t('LoginScreen.incorrectEmail'),
          });
          Segment.trackWithProperties('Login Error', {
            'Error Type': 'invalid email',
          });
        } else if (err.message === 'Invalid Password') {
          dropdownError({
            message: i18n.t('LoginScreen.incorrectPassword'),
          });
          Segment.trackWithProperties('Login Error', {
            'Error Type': 'invalid password',
          });
        } else if (err.message === 'timeout') {
          dropdownError({ message: i18n.t('Error.timedOut') });
        } else {
          dropdownError({ message: i18n.t('Error.requestIncomplete') });
        }
      }
    }
  };

  render(): JSX.Element {
    return (
      <TouchableOpacity
        accessible={false}
        style={{ flex: 1, backgroundColor: 'white' }}
        onPress={Keyboard.dismiss}
        activeOpacity={1.0}
      >
        <KeyboardAvoider
          style={{ flexDirection: 'column', justifyContent: 'center' }}
        >
          <TouchableOpacity
            activeOpacity={1.0}
            style={{
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={{ width: '100%', height: 60 }} />
              <View style={Styles.loginBackground}>
                <Text style={[Typography.FONT_SEMIBOLD, { fontSize: 26 }]}>
                  {i18n.t('LoginScreen.welcomeBack')}
                </Text>
                <Text style={[Typography.FONT_REGULAR, Styles.subtitle]}>
                  {i18n.t('LoginScreen.logInWithEmailAndPassword')}
                </Text>
                <Input
                  ref={this.emailRef}
                  parentStyle={Styles.fullWidth}
                  placeholder={i18n.t('LoginScreen.emailAddress')}
                  nextInput={this.passwordRef}
                />
                <Input
                  ref={this.passwordRef}
                  parentStyle={Styles.fullWidth}
                  placeholder={i18n.t('LoginScreen.password')}
                  secure
                />
                {null && (
                  <CheckBox
                    checkedIcon={<Icon svg={CheckedIcon} />}
                    uncheckedIcon={<Icon svg={UncheckedIcon} />}
                    center
                    title={i18n.t('LoginScreen.rememberMe')}
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
                )}
                <Button
                  containerStyle={Styles.button}
                  textStyle={Typography.FONT_SEMIBOLD}
                  buttonText={i18n.t('LoginScreen.login')}
                  blocking
                  onPress={this.onLogin}
                />
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ paddingTop: 16, fontSize: 16 }}>
                    {i18n.t('LoginScreen.forgotYourPassword')}
                  </Text>
                  <Button
                    link
                    containerStyle={Styles.forgotContainer}
                    buttonText={i18n.t('LoginScreen.resetIt')}
                    onPress={() => {
                      Segment.track('Clicks on Forgot Password');
                      Linking.openURL(
                        'https://letters.ameelio.org/password/reset'
                      );
                      Keyboard.dismiss();
                    }}
                  />
                </View>
                <View
                  accessible
                  accessibilityLabel="By creating an account, you agree to the terms of service and privacy policy."
                  style={{ flexDirection: 'row', justifyContent: 'center' }}
                >
                  <Text style={Typography.FONT_REGULAR}>
                    {i18n.t('LoginScreen.termsCondition')}
                  </Text>
                </View>
                <View style={Styles.termsContainer}>
                  <Button
                    link
                    buttonText={i18n.t('LoginScreen.termsOfService')}
                    onPress={() => {
                      this.props.navigation.navigate(Screens.Terms);
                    }}
                  />
                  <Text accessible={false} style={Typography.FONT_REGULAR}>
                    {i18n.t('LoginScreen.termsConditionAnd')}
                  </Text>
                  <Button
                    link
                    buttonText={i18n.t('LoginScreen.privacyPolicy')}
                    onPress={() => {
                      this.props.navigation.navigate(Screens.Privacy);
                    }}
                  />
                  <Text style={Typography.FONT_REGULAR}>.</Text>
                </View>
                {null && (
                  <Button onPress={this.devSkip} buttonText="Dev Skip" />
                )}
                <View style={{ width: '100%', height: 100 }} />
              </View>
            </ScrollView>
          </TouchableOpacity>
        </KeyboardAvoider>
      </TouchableOpacity>
    );
  }
}

export default LoginScreen;
