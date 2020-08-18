import React, { createRef } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigations';
import { Button, Input } from '@components';
import i18n from '@i18n';
import { Typography } from '@styles';
import { REFERERS, sleep } from '@utils';
import Styles from './Register.style';

type Register1ScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register1'
>;

export interface Props {
  navigation: Register1ScreenNavigationProp;
}

export interface State {
  valid: boolean;
}

class Register1Screen extends React.Component<Props, State> {
  private firstName = createRef<Input>();

  private lastName = createRef<Input>();

  private referrer = createRef<Input>();

  private scrollView = createRef<ScrollView>();

  private unsubscribeFocus: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      valid: false,
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
    if (this.firstName.current) this.firstName.current.forceFocus();
  }

  updateValid = (): void => {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.referrer.current
    ) {
      const result =
        this.firstName.current.state.valid &&
        this.lastName.current.state.valid &&
        this.referrer.current.state.valid;
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
            ref={this.scrollView}
            keyboardShouldPersistTaps="always"
            scrollEnabled
            style={{ width: '100%', flex: 1 }}
            contentContainerStyle={{ paddingTop: 24, paddingBottom: 72 }}
          >
            <Text
              style={[
                Typography.FONT_BOLD,
                { fontSize: 20, alignSelf: 'flex-start', paddingBottom: 16 },
              ]}
            >
              {i18n.t('RegisterScreen.registerAccount')}
            </Text>
            <Input
              ref={this.firstName}
              parentStyle={Styles.fullWidth}
              placeholder={i18n.t('RegisterScreen.firstName')}
              required
              onValid={this.updateValid}
              onInvalid={() => this.setState({ valid: false })}
              blurOnSubmit={false}
              nextInput={this.lastName}
            />
            <Input
              ref={this.lastName}
              parentStyle={Styles.fullWidth}
              placeholder={i18n.t('RegisterScreen.lastName')}
              required
              onValid={this.updateValid}
              onInvalid={() => this.setState({ valid: false })}
              blurOnSubmit={false}
              nextInput={this.referrer}
            />
            <Input
              ref={this.referrer}
              parentStyle={Styles.fullWidth}
              placeholder={i18n.t('RegisterScreen.referrer')}
              required
              options={REFERERS}
              onFocus={async () => {
                await sleep(400);
                if (this.scrollView.current)
                  this.scrollView.current.scrollToEnd({ animated: true });
              }}
              onValid={this.updateValid}
              onInvalid={() => this.setState({ valid: false })}
              blurOnSubmit={false}
              onSubmitEditing={() => {
                if (this.state.valid) {
                  this.props.navigation.navigate('Register2', {
                    firstName: this.firstName.current
                      ? this.firstName.current.state.value
                      : '',
                    lastName: this.lastName.current
                      ? this.lastName.current.state.value
                      : '',
                    referrer: this.referrer.current
                      ? this.referrer.current.state.value
                      : '',
                  });
                }
              }}
            />
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
          <View
            style={[
              Styles.fullWidth,
              {
                position: 'absolute',
                bottom: 0,
                paddingBottom: 8,
                backgroundColor: 'white',
              },
            ]}
          >
            <Button
              containerStyle={[Styles.fullWidth, Styles.registerButton]}
              buttonText={i18n.t('RegisterScreen.next')}
              enabled={this.state.valid}
              onPress={() => {
                this.props.navigation.navigate('Register2', {
                  firstName: this.firstName.current
                    ? this.firstName.current.state.value
                    : '',
                  lastName: this.lastName.current
                    ? this.lastName.current.state.value
                    : '',
                  referrer: this.referrer.current
                    ? this.referrer.current.state.value
                    : '',
                });
              }}
              showNextIcon
            />
          </View>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  }
}

export default Register1Screen;
