import React, { createRef } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList, Screens } from '@utils/Screens';
import { Input, KeyboardAvoider, Picker, PickerRef } from '@components';
import i18n from '@i18n';
import { Typography } from '@styles';
import { Validation, STATES_DROPDOWN } from '@utils';
import { Image } from 'types';
import * as Segment from 'expo-analytics-segment';
import { UserRegisterInfo } from '@store/User/UserTypes';
import { register } from '@api';
import * as Notifs from '@notifications';
import { NotifTypes } from '@store/Notif/NotifTypes';
import { popupAlert } from '@components/Alert/Alert.react';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import { setProfileOverride } from '@components/Topbar/Topbar.react';
import Styles from './Register.style';

type RegisterAddressScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'RegisterAddress'
>;

export interface Props {
  navigation: RegisterAddressScreenNavigationProp;
  route: {
    params: {
      email: string;
      password: string;
      passwordConfirmation: string;
      remember: boolean;
      firstName: string;
      lastName: string;
      referrer: string;
      image: Image | undefined;
    };
  };
}

export interface State {
  valid: boolean;
}

class RegisterAddressScreen extends React.Component<Props, State> {
  private address1 = createRef<Input>();

  private address2 = createRef<Input>();

  private city = createRef<Input>();

  private statePicker = createRef<PickerRef>();

  private postal = createRef<Input>();

  private scrollView = createRef<ScrollView>();

  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  constructor(props: Props) {
    super(props);
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
    if (this.address1.current) this.address1.current.forceFocus();
    this.updateValid();
  }

  onNavigationBlur = (): void => {
    setProfileOverride(undefined);
  };

  updateValid = (): void => {
    if (
      this.address1.current &&
      this.address2.current &&
      this.city.current &&
      this.statePicker.current &&
      this.postal.current
    ) {
      const result =
        this.address1.current.state.valid &&
        this.address2.current.state.valid &&
        this.city.current.state.valid &&
        this.statePicker.current.isValueSelected() &&
        this.postal.current.state.valid;
      setProfileOverride({
        enabled: result,
        text: i18n.t('RegisterScreen.register'),
        action: this.doRegister,
        blocking: true,
      });
    }
  };

  doRegister = async (): Promise<void> => {
    Segment.track("Signup - Clicks 'Create Account'");
    const data: UserRegisterInfo = {
      ...this.props.route.params,
      address1: this.address1.current ? this.address1.current.state.value : '',
      address2: this.address2.current ? this.address2.current.state.value : '',
      city: this.city.current ? this.city.current.state.value : '',
      phyState: this.statePicker.current ? this.statePicker.current.value : '',
      postal: this.postal.current ? this.postal.current.state.value : '',
    };
    try {
      await register(data);
      Segment.track('Signup - Account Created');
      Notifs.scheduleNotificationInDays(
        {
          title: `${i18n.t('Notifs.youreOneTapAway')}`,
          body: `${i18n.t('Notifs.clickHereToBegin')}`,
          type: NotifTypes.NoFirstContact,
        },
        1
      );
    } catch (err) {
      if (err.data && err.data.email) {
        Segment.trackWithProperties('Signup - Account Creation Error', {
          'Error Type': 'invalid email',
        });
        popupAlert({
          title: i18n.t('RegisterScreen.emailAlreadyInUse'),
          buttons: [
            {
              text: i18n.t('RegisterScreen.login'),
              onPress: () => this.props.navigation.replace(Screens.Login),
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
            ref={this.scrollView}
            keyboardShouldPersistTaps="always"
            scrollEnabled
            style={{ width: '100%', flex: 1 }}
            contentContainerStyle={{ paddingVertical: 24 }}
          >
            <Text
              style={[
                Typography.FONT_SEMIBOLD,
                { fontSize: 20, alignSelf: 'flex-start', paddingBottom: 8 },
              ]}
            >
              {i18n.t('RegisterScreen.enterBasic')},{' '}
              {this.props.route.params.firstName}!
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
              onInvalid={this.updateValid}
              blurOnSubmit={false}
              nextInput={this.address2}
            />
            <Input
              ref={this.address2}
              parentStyle={Styles.fullWidth}
              placeholder={i18n.t('RegisterScreen.addressLine2')}
              validate={Validation.Address}
              onValid={this.updateValid}
              onInvalid={this.updateValid}
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
              onInvalid={this.updateValid}
              blurOnSubmit={false}
            />
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
              }}
            >
              <Picker
                ref={this.statePicker}
                parentStyle={{ flex: 5, marginRight: 4 }}
                items={STATES_DROPDOWN}
                placeholder={i18n.t('RegisterScreen.state')}
                onValueChange={() => {
                  this.updateValid();
                }}
              />
              <Input
                ref={this.postal}
                placeholder={i18n.t('RegisterScreen.zipcode')}
                parentStyle={{ flex: 3, marginLeft: 4 }}
                required
                validate={Validation.Postal}
                onValid={this.updateValid}
                onInvalid={this.updateValid}
                blurOnSubmit={false}
              />
            </View>
          </ScrollView>
        </KeyboardAvoider>
      </TouchableOpacity>
    );
  }
}

export default RegisterAddressScreen;
