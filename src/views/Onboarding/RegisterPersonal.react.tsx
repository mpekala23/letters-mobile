import React, { createRef, Dispatch } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList, Screens } from '@utils/Screens';
import {
  Input,
  PicUpload,
  KeyboardAvoider,
  Picker,
  PickerRef,
} from '@components';
import i18n from '@i18n';
import { Typography } from '@styles';
import { REFERRERS } from '@utils';
import { Image, TopbarRight } from 'types';
import { PicUploadTypes } from '@components/PicUpload/PicUpload.react';
import * as Segment from 'expo-analytics-segment';
import COUNTRIES_FULL_TO_ABBREVS from '@utils/Countries';
import { UIActionTypes } from '@store/UI/UITypes';
import { setTopbarRight } from '@store/UI/UIActions';
import { connect } from 'react-redux';
import Styles from './Register.style';

type RegisterPersonalScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'RegisterPersonal'
>;

export interface Props {
  navigation: RegisterPersonalScreenNavigationProp;
  route: {
    params: {
      email: string;
      password: string;
      passwordConfirmation: string;
      remember: boolean;
    };
  };
  setTopbarRight: (details: TopbarRight | null) => void;
}

export interface State {
  valid: boolean;
  image: Image | undefined;
}

class RegisterPersonalScreenBase extends React.Component<Props, State> {
  private firstName = createRef<Input>();

  private lastName = createRef<Input>();

  private referrerPicker = createRef<PickerRef>();

  private countryPicker = createRef<PickerRef>();

  private scrollView = createRef<ScrollView>();

  private unsubscribeFocus: () => void;

  private unsubscribeBlur: () => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      valid: false,
      image: undefined,
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
    if (this.firstName.current) this.firstName.current.forceFocus();
    if (this.countryPicker.current?.value === '')
      this.countryPicker.current.setStoredValue(COUNTRIES_FULL_TO_ABBREVS.US);
    this.updateValid();
  }

  onNavigationBlur = (): void => {
    this.props.setTopbarRight(null);
  };

  goForward = (): void => {
    Segment.trackWithProperties('Signup - Clicks on Next', {
      step: 'Personal',
    });
    this.props.navigation.navigate(Screens.RegisterAddress, {
      ...this.props.route.params,
      firstName: this.firstName.current
        ? this.firstName.current.state.value
        : '',
      lastName: this.lastName.current ? this.lastName.current.state.value : '',
      referrer: this.referrerPicker.current
        ? this.referrerPicker.current.value
        : '',
      image: this.state.image,
      country: this.countryPicker.current
        ? this.countryPicker.current?.value
        : '',
    });
  };

  updateValid = (): void => {
    if (
      this.firstName.current &&
      this.lastName.current &&
      this.referrerPicker.current &&
      this.countryPicker.current
    ) {
      const result =
        this.firstName.current.state.valid &&
        this.lastName.current.state.valid &&
        this.referrerPicker.current.isValueSelected() &&
        this.countryPicker.current.isValueSelected();
      this.setState({ valid: result });
      this.props.setTopbarRight({
        enabled: result,
        text: i18n.t('RegisterScreen.next'),
        action: this.goForward,
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
            ref={this.scrollView}
            keyboardShouldPersistTaps="always"
            scrollEnabled
            style={{ width: '100%' }}
            contentContainerStyle={{
              paddingVertical: 24,
            }}
          >
            <TouchableOpacity style={{ flex: 1 }} activeOpacity={1.0}>
              <Text
                style={[
                  Typography.FONT_SEMIBOLD,
                  {
                    fontSize: 20,
                    alignSelf: 'flex-start',
                    paddingBottom: 16,
                  },
                ]}
              >
                {i18n.t('RegisterScreen.registerAccount')}
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: 24,
                  width: '100%',
                  transform: [{ scale: 1.25 }],
                }}
              >
                <PicUpload
                  type={PicUploadTypes.Profile}
                  avatarPlaceholder
                  onSuccess={(image: Image) => this.setState({ image })}
                  onDelete={() => this.setState({ image: undefined })}
                />
              </View>
              <Text
                style={[
                  Typography.FONT_REGULAR,
                  {
                    fontSize: 14,
                    alignSelf: 'center',
                    paddingBottom: 16,
                    paddingTop: 32,
                  },
                ]}
              >
                {i18n.t('RegisterScreen.clickToUploadProfileImage')}
              </Text>
              <Input
                ref={this.firstName}
                parentStyle={Styles.fullWidth}
                placeholder={i18n.t('RegisterScreen.firstName')}
                required
                onValid={this.updateValid}
                onInvalid={this.updateValid}
                blurOnSubmit={false}
                nextInput={this.lastName}
              />
              <Input
                ref={this.lastName}
                parentStyle={Styles.fullWidth}
                placeholder={i18n.t('RegisterScreen.lastName')}
                required
                onValid={this.updateValid}
                onInvalid={this.updateValid}
                blurOnSubmit={false}
              />
              <Picker
                ref={this.countryPicker}
                items={Object.values(COUNTRIES_FULL_TO_ABBREVS)}
                placeholder={i18n.t('RegisterScreen.country')}
                onValueChange={() => {
                  this.updateValid();
                }}
              />
              <Picker
                ref={this.referrerPicker}
                items={REFERRERS}
                placeholder={i18n.t('RegisterScreen.referrer')}
                onValueChange={() => {
                  this.updateValid();
                  if (this.state.valid) {
                    this.goForward();
                  }
                }}
              />
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoider>
      </TouchableOpacity>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<UIActionTypes>) => ({
  setTopbarRight: (details: TopbarRight | null) =>
    dispatch(setTopbarRight(details)),
});
const RegisterPersonalScreen = connect(
  null,
  mapDispatchToProps
)(RegisterPersonalScreenBase);

export default RegisterPersonalScreen;
