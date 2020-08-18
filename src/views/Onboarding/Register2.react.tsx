import React, { createRef } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigations';
import { Button, Input } from '@components';
import i18n from '@i18n';
import { Typography } from '@styles';
import { Validation } from '@utils';
import Styles from './Register.style';

type Register1ScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register2'
>;

export interface Props {
  navigation: Register1ScreenNavigationProp;
  route: {
    params: {
      firstName: string;
      lastName: string;
    };
  };
}

export interface State {
  valid: boolean;
  password: string;
  passwordConfirmation: string;
}

class Register2Screen extends React.Component<Props, State> {
  private email = createRef<Input>();

  private password = createRef<Input>();

  private passwordConfirmation = createRef<Input>();

  private unsubscribeFocus: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      valid: false,
      password: '',
      passwordConfirmation: '',
    };
    this.onNavigationFocus = this.onNavigationFocus.bind(this);
    this.unsubscribeFocus = this.props.navigation.addListener(
      'focus',
      this.onNavigationFocus
    );
  }

  componentWillUnmount(): void {
    this.unsubscribeFocus();
  }

  onNavigationFocus(): void {
    if (this.email.current) this.email.current.forceFocus();
  }

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
        <KeyboardAvoidingView
          style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : -200}
          enabled
        >
          <ScrollView
            keyboardShouldPersistTaps="always"
            scrollEnabled
            style={{ width: '100%', flex: 1 }}
            contentContainerStyle={{ paddingVertical: 24, flex: 1 }}
          >
            <Text
              style={[
                Typography.FONT_BOLD,
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
              onInvalid={() => this.setState({ valid: false })}
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
              onInvalid={() => this.setState({ valid: false })}
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
              onInvalid={() => this.setState({ valid: false })}
              blurOnSubmit={false}
              onSubmitEditing={() => {
                if (this.state.valid) {
                  this.props.navigation.navigate('Register3', {
                    ...this.props.route.params,
                    email: this.email.current
                      ? this.email.current.state.value
                      : '',
                    password: this.password.current
                      ? this.password.current.state.value
                      : '',
                  });
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
            <Button
              containerStyle={[
                Styles.fullWidth,
                Styles.registerButton,
                { position: 'absolute', bottom: 8 },
              ]}
              buttonText={i18n.t('RegisterScreen.next')}
              enabled={this.state.valid}
              onPress={() => {
                this.props.navigation.navigate('Register3', {
                  ...this.props.route.params,
                  email: this.email.current
                    ? this.email.current.state.value
                    : '',
                  password: this.password.current
                    ? this.password.current.state.value
                    : '',
                });
              }}
              showNextIcon
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  }
}

export default Register2Screen;
