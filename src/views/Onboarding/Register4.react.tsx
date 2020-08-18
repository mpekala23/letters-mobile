import React, { createRef } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '@navigations';
import { Button, Input } from '@components';
import i18n from '@i18n';
import { Typography } from '@styles';
import Styles from './Register.style';

type Register4ScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register4'
>;

export interface Props {
  navigation: Register4ScreenNavigationProp;
}

export interface State {
  image: Image | undefined;
}

class Register1Screen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      image: undefined,
    };
  }

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
                { fontSize: 20, alignSelf: 'center', paddingBottom: 16 },
              ]}
            >
              {i18n.t('RegisterScreen.oneLastThing')}
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
              onSubmitEditing={() => {
                if (this.state.valid) {
                  this.props.navigation.navigate('Register2', {
                    firstName: this.firstName.current
                      ? this.firstName.current.state.value
                      : '',
                    lastName: this.lastName.current
                      ? this.lastName.current.state.value
                      : '',
                  });
                }
              }}
            />
            <Button
              link
              buttonText={i18n.t('RegisterScreen.alreadyHaveAnAccount')}
              containerStyle={{ marginBottom: 20, alignSelf: 'center' }}
              onPress={() => {
                this.props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'Begin' }, { name: 'Login' }],
                });
              }}
            />
            <Button
              containerStyle={[
                Styles.fullWidth,
                Styles.registerButton,
                { position: 'absolute', bottom: 8 },
              ]}
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

export default Register1Screen;
