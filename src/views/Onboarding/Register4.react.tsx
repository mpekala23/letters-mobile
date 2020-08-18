import React from 'react';
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
import { Button, PicUpload } from '@components';
import i18n from '@i18n';
import { Typography } from '@styles';
import { PicUploadTypes } from '@components/PicUpload/PicUpload.react';
import { Image } from 'types';
import * as Segment from 'expo-analytics-segment';
import { UserRegisterInfo } from '@store/User/UserTypes';
import { register } from '@api';
import Notifs from '@notifications';
import { NotifTypes } from '@store/Notif/NotifTypes';
import { hoursTill8Tomorrow } from '@utils';
import { popupAlert } from '@components/Alert/Alert.react';
import { dropdownError } from '@components/Dropdown/Dropdown.react';
import Styles from './Register.style';

type Register4ScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  'Register4'
>;

export interface Props {
  navigation: Register4ScreenNavigationProp;
  route: {
    params: {
      firstName: string;
      lastName: string;
      referrer: string;
      email: string;
      password: string;
      passwordConfirmation: string;
      remember: boolean;
      address1: string;
      address2: string;
      city: string;
      phyState: string;
      postal: string;
    };
  };
}

export interface State {
  image: Image | undefined;
}

class Register4Screen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      image: undefined,
    };
  }

  doRegister = async (): Promise<void> => {
    Segment.track("Signup - Clicks 'Create Account'");
    const data: UserRegisterInfo = {
      ...this.props.route.params,
      image: this.state.image,
    };
    try {
      await register(data);
      Segment.track('Signup - Account Created');
      Notifs.scheduleNotificationInHours(
        {
          title: `${i18n.t('Notifs.youreOneTapAway')}`,
          body: `${i18n.t('Notifs.clickHereToBegin')}`,
          data: {
            type: NotifTypes.NoFirstContact,
          },
        },
        hoursTill8Tomorrow()
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
                { fontSize: 20, alignSelf: 'center', paddingBottom: 16 },
              ]}
            >
              {i18n.t('RegisterScreen.oneLastThing')}
            </Text>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: 24,
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
            <Button
              containerStyle={[
                Styles.fullWidth,
                Styles.registerButton,
                { position: 'absolute', bottom: 8 },
              ]}
              buttonText={i18n.t('RegisterScreen.register')}
              blocking
              onPress={this.doRegister}
              showNextIcon
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableOpacity>
    );
  }
}

export default Register4Screen;
