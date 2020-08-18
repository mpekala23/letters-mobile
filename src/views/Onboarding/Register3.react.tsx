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
import { Validation, STATES_DROPDOWN, sleep } from '@utils';
import Styles from './Register.style';

type Register3ScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register3'
>;

export interface Props {
  navigation: Register3ScreenNavigationProp;
  route: {
    params: {
      firstName: string;
      lastName: string;
      referrer: string;
      email: string;
      password: string;
      passwordConfirmation: string;
      remember: boolean;
    };
  };
}

export interface State {
  valid: boolean;
}

class Register3Screen extends React.Component<Props, State> {
  private address1 = createRef<Input>();

  private address2 = createRef<Input>();

  private city = createRef<Input>();

  private phyState = createRef<Input>();

  private postal = createRef<Input>();

  private passwordConfirmation = createRef<Input>();

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
    if (this.address1.current) this.address1.current.forceFocus();
  }

  updateValid = (): void => {
    if (
      this.address1.current &&
      this.address2.current &&
      this.city.current &&
      this.phyState.current &&
      this.postal.current
    ) {
      const result =
        this.address1.current.state.valid &&
        this.address2.current.state.valid &&
        this.city.current.state.valid &&
        this.phyState.current.state.valid &&
        this.postal.current.state.valid;
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
                { fontSize: 20, alignSelf: 'flex-start', paddingBottom: 8 },
              ]}
            >
              {i18n.t('RegisterScreen.enterBasic')}
            </Text>
            <Text style={[Typography.FONT_REGULAR, { paddingBottom: 8 }]}>
              {i18n.t('RegisterScreen.weWillOnly')}
            </Text>
            <Input
              ref={this.address1}
              parentStyle={Styles.fullWidth}
              placeholder={i18n.t('RegisterScreen.addressLine1')}
              required
              validate={Validation.Address}
              onValid={this.updateValid}
              onInvalid={() => this.setState({ valid: false })}
              blurOnSubmit={false}
              nextInput={this.address2}
            />
            <Input
              ref={this.address2}
              parentStyle={Styles.fullWidth}
              placeholder={i18n.t('RegisterScreen.addressLine2')}
              validate={Validation.Address}
              onValid={this.updateValid}
              onInvalid={() => this.setState({ valid: false })}
              blurOnSubmit={false}
              nextInput={this.city}
            />
            <Input
              ref={this.city}
              parentStyle={Styles.fullWidth}
              placeholder={i18n.t('RegisterScreen.city')}
              required
              validate={Validation.City}
              onValid={this.updateValid}
              onInvalid={() => this.setState({ valid: false })}
              blurOnSubmit={false}
              nextInput={this.phyState}
            />
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
              }}
            >
              <Input
                ref={this.phyState}
                placeholder={i18n.t('RegisterScreen.state')}
                parentStyle={{ flex: 1, marginRight: 4 }}
                required
                validate={Validation.State}
                options={STATES_DROPDOWN}
                onValid={this.updateValid}
                onInvalid={() => this.setState({ valid: false })}
                onFocus={async () => {
                  await sleep(400);
                  if (this.scrollView.current)
                    this.scrollView.current.scrollToEnd({ animated: true });
                }}
                blurOnSubmit={false}
                nextInput={this.postal}
              />
              <Input
                ref={this.postal}
                placeholder={i18n.t('RegisterScreen.zipcode')}
                parentStyle={{ flex: 1, marginLeft: 4 }}
                required
                validate={Validation.Postal}
                onValid={this.updateValid}
                onInvalid={() => this.setState({ valid: false })}
                blurOnSubmit={false}
                onSubmitEditing={() => {
                  if (this.state.valid) {
                    this.props.navigation.navigate('Register4', {
                      ...this.props.route.params,
                      address1: this.address1.current
                        ? this.address1.current.state.value
                        : '',
                      address2: this.address2.current
                        ? this.address2.current.state.value
                        : '',
                      city: this.city.current
                        ? this.city.current.state.value
                        : '',
                      phyState: this.phyState.current
                        ? this.phyState.current.state.value
                        : '',
                      postal: this.postal.current
                        ? this.postal.current.state.value
                        : '',
                    });
                  }
                }}
              />
            </View>
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
                this.props.navigation.navigate('Register4', {
                  ...this.props.route.params,
                  address1: this.address1.current
                    ? this.address1.current.state.value
                    : '',
                  address2: this.address2.current
                    ? this.address2.current.state.value
                    : '',
                  city: this.city.current ? this.city.current.state.value : '',
                  phyState: this.phyState.current
                    ? this.phyState.current.state.value
                    : '',
                  postal: this.postal.current
                    ? this.postal.current.state.value
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

export default Register3Screen;
