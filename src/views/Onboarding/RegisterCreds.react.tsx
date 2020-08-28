import React, { createRef } from 'react';
import { ScrollView, Platform, Text, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigations';
import { Button, Input, Icon, KeyboardAvoider } from '@components';
import i18n from '@i18n';
import { Typography } from '@styles';
import { Validation } from '@utils';
import CheckedIcon from '@assets/views/Onboarding/Checked';
import UncheckedIcon from '@assets/views/Onboarding/Unchecked';
import { CheckBox } from 'react-native-elements';
import { setProfileOverride } from '@components/Topbar/Topbar.react';
import * as Segment from 'expo-analytics-segment';
import Styles from './Register.style';

type RegisterCredsScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'RegisterCreds'
>;

export interface Props {
  navigation: RegisterCredsScreenNavigationProp;
  route: {
    params: Record<string, unknown>;
  };
}

export interface State {
  valid: boolean;
  password: string;
  passwordConfirmation: string;
  remember: boolean;
}

class RegisterCredsScreen extends React.Component<Props, State> {
  private email = createRef<Input>();

  private password = createRef<Input>();

  private passwordConfirmation = createRef<Input>();

  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      valid: false,
      password: '',
      passwordConfirmation: '',
      remember: true,
    };
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.unsubscribeFocus = this.props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
    this.unsubscribeBlur = this.props.navigation.addListener(
      'blur',
      this.onNavigationBlur
    );
  }

  componentWillUnmount(): void {
    this.unsubscribeFocus();
    this.unsubscribeBlur();
  }

  onNavigationFocus(): void {
    if (this.email.current) this.email.current.forceFocus();
    this.updateValid();
  }

  onNavigationBlur = (): void => {
    setProfileOverride(undefined);
  };

  goForward = (): void => {
    Segment.trackWithProperties('Signup - Clicks on Next', { step: 'Account' });
    this.props.navigation.navigate('RegisterPersonal', {
      ...this.props.route.params,
      email: this.email.current ? this.email.current.state.value : '',
      password: this.password.current ? this.password.current.state.value : '',
      passwordConfirmation: this.passwordConfirmation.current
        ? this.passwordConfirmation.current.state.value
        : '',
      remember: true,
    });
  };

  updateValid = (): void => {
    if (
      this.email.current &&
      this.password.current &&
      this.passwordConfirmation.current
    ) {
      const result =
        this.email.current.state.valid &&
        this.password.current.state.valid &&
        this.passwordConfirmation.current.state.valid &&
        this.password.current.state.value ===
          this.passwordConfirmation.current.state.value;
      this.setState({ valid: result });
      setProfileOverride({
        enabled: result,
        text: i18n.t('RegisterScreen.next'),
        action: this.goForward,
        blocking: true,
      });
    }
  };

  render(): JSX.Element {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          backgroundColor: 'white',
          paddingHorizontal: 16,
        }}
        activeOpacity={1.0}
      >
        <KeyboardAvoider
          style={{ flexDirection: 'column', justifyContent: 'center' }}
        >
          <ScrollView
            keyboardShouldPersistTaps="always"
            scrollEnabled
            style={{ width: '100%', flex: 1 }}
            contentContainerStyle={{ paddingVertical: 24, flex: 1 }}
          >
            <Text
              style={[
                Typography.FONT_SEMIBOLD,
                { fontSize: 20, alignSelf: 'flex-start', paddingBottom: 16 },
              ]}
            >
              {i18n.t('RegisterScreen.enterBasic')}
            </Text>
            <Input
              ref={this.email}
              parentStyle={Styles.fullWidth}
              placeholder={i18n.t('RegisterScreen.emailAddress')}
              required
              validate={Validation.Email}
              onValid={this.updateValid}
              onInvalid={this.updateValid}
              blurOnSubmit={false}
              nextInput={this.password}
            />
            <Input
              ref={this.password}
              parentStyle={Styles.fullWidth}
              placeholder={i18n.t('RegisterScreen.password')}
              required
              validate={Validation.Password}
              secure
              onChangeText={(val: string) => {
                this.setState({ password: val });
                if (this.passwordConfirmation.current) {
                  this.passwordConfirmation.current.setState({
                    valid:
                      this.passwordConfirmation.current.state.value === val,
                  });
                }
              }}
              onValid={this.updateValid}
              onInvalid={this.updateValid}
              invalidFeedback={i18n.t('RegisterScreen.passwordInvalid')}
              blurOnSubmit={false}
              nextInput={this.passwordConfirmation}
            />
            <Input
              ref={this.passwordConfirmation}
              parentStyle={Styles.fullWidth}
              placeholder={i18n.t('RegisterScreen.confirmPassword')}
              required
              validate={Validation.Password}
              secure
              mustMatch={this.state.password}
              onChangeText={(val: string) => {
                this.setState({ passwordConfirmation: val });
                if (
                  this.password.current &&
                  this.passwordConfirmation.current
                ) {
                  this.passwordConfirmation.current.setState({
                    valid: this.password.current.state.value === val,
                  });
                }
              }}
              onValid={this.updateValid}
              onInvalid={this.updateValid}
              blurOnSubmit={false}
              onSubmitEditing={() => {
                if (this.state.valid) {
                  this.goForward();
                }
              }}
            />
            {this.state.password !== this.state.passwordConfirmation && (
              <Text
                style={[
                  Typography.FONT_REGULAR,
                  { textAlign: 'center', width: '100%' },
                ]}
              >
                {i18n.t('RegisterScreen.passwordsMustMatch')}
              </Text>
            )}
            {null && (
              <CheckBox
                checkedIcon={<Icon svg={CheckedIcon} />}
                uncheckedIcon={<Icon svg={UncheckedIcon} />}
                center
                title="Remember Me"
                containerStyle={{
                  backgroundColor: 'white',
                  width: '50%',
                  borderWidth: 0,
                  alignSelf: 'center',
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
              link
              buttonText={i18n.t('RegisterScreen.alreadyHaveAnAccount')}
              containerStyle={{
                marginBottom: 20,
                marginTop: 16,
                alignSelf: 'center',
              }}
              onPress={() => {
                this.props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'Begin' }, { name: 'Login' }],
                });
              }}
            />
          </ScrollView>
        </KeyboardAvoider>
      </TouchableOpacity>
    );
  }
}

export default RegisterCredsScreen;
