import React, { createRef } from 'react';
import { View, Text, TouchableOpacity, Keyboard, Animated } from 'react-native';
import { ProfilePicTypes, TopbarRouteAction, TopbarBackAction } from 'types';
import { UserState } from '@store/User/UserTypes';
import BackButton from '@assets/components/Topbar/BackButton';
import { Colors, Typography } from '@styles';
import { NavigationContainerRef } from '@react-navigation/native';
import * as Segment from 'expo-analytics-segment';
import ProfilePic from '../ProfilePic/ProfilePic.react';
import Styles, { barHeight } from './Topbar.styles';
import Icon from '../Icon/Icon.react';
import Button from '../Button/Button.react';

interface Props {
  userState: UserState;
  navigation: NavigationContainerRef | null;
  currentRoute: string;
}

interface State {
  shown: boolean;
  shownAnim: Animated.Value;
  title: string;
  profile: boolean;
  backOverride?: TopbarBackAction;
  profileOverride?: {
    enabled: boolean;
    text: string;
    action: () => void | Promise<void>;
    blocking?: boolean;
  };
}

class Topbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      shown: false,
      shownAnim: new Animated.Value(0),
      title: '',
      profile: true,
    };
    this.renderBackButton = this.renderBackButton.bind(this);
  }

  renderBackButton(): JSX.Element | null {
    if (this.state.backOverride) {
      return (
        <TouchableOpacity
          style={Styles.backContainer}
          onPress={() => {
            Keyboard.dismiss();
            if (this.state.backOverride) this.state.backOverride.action();
          }}
          testID="backButton"
        >
          <Icon svg={BackButton} />
        </TouchableOpacity>
      );
    }
    if (
      this.props.navigation &&
      (this.props.navigation.canGoBack() ||
        this.props.currentRoute === 'Login' ||
        this.props.currentRoute === 'Register1')
    ) {
      return (
        <TouchableOpacity
          style={Styles.backContainer}
          onPress={() => {
            Keyboard.dismiss();
            if (this.props.navigation) {
              const route = this.props.navigation.getCurrentRoute()?.name;
              if (route === 'Login' || route === 'Register1') {
                this.props.navigation.reset({
                  index: 0,
                  routes: [{ name: 'Begin' }],
                });
              }
              if (
                route === 'ContactInfo' ||
                route === 'FacilityDirectory' ||
                route === 'AddManually' ||
                route === 'ReviewContact'
              ) {
                let logName = '';
                if (route === 'ContactInfo') {
                  logName = 'info';
                } else if (route === 'FacilityDirectory') {
                  logName = 'facility';
                } else if (route === 'AddManually') {
                  logName = 'manual';
                } else {
                  logName = 'review';
                }
                Segment.trackWithProperties('Add Contact - Click on Back', {
                  page: logName,
                });
              }
              this.props.navigation.goBack();
            }
          }}
          testID="backButton"
        >
          <Icon svg={BackButton} />
        </TouchableOpacity>
      );
    }
    return null;
  }

  render(): JSX.Element {
    let topRight;
    if (this.state.profile && this.props.userState.authInfo.isLoggedIn) {
      topRight = (
        <ProfilePic
          firstName={this.props.userState.user.firstName}
          lastName={this.props.userState.user.lastName}
          imageUri={this.props.userState.user.photo?.uri}
          type={ProfilePicTypes.Topbar}
        />
      );
    } else if (this.state.profileOverride) {
      topRight = (
        <Button
          enabled={this.state.profileOverride.enabled}
          blocking={this.state.profileOverride.blocking}
          onPress={() => {
            Keyboard.dismiss();
            if (this.state.profileOverride) this.state.profileOverride.action();
          }}
          buttonText={this.state.profileOverride.text}
          containerStyle={{ borderRadius: 20 }}
        />
      );
    } else {
      topRight = <View testID="blank" />;
    }
    return (
      <Animated.View
        style={[
          Styles.barContainer,
          {
            opacity: this.state.shownAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
            height: this.state.shownAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, barHeight],
            }),
            shadowColor: this.state.shown ? '#000' : '#fff',
            elevation: this.state.shown ? 5 : 0,
          },
        ]}
      >
        {this.renderBackButton()}
        <Text
          style={[
            Typography.FONT_MEDIUM,
            { fontSize: 16, color: Colors.GRAY_DARK },
          ]}
        >
          {this.state.title}
        </Text>
        <View style={{ position: 'absolute', right: 19, paddingTop: 10 }}>
          {topRight}
        </View>
      </Animated.View>
    );
  }
}

export const topbarRef = createRef<Topbar>();

export const setShown = (val: boolean): void => {
  if (topbarRef.current) {
    Animated.timing(topbarRef.current.state.shownAnim, {
      toValue: val ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      if (topbarRef.current) topbarRef.current.setState({ shown: val });
    });
  }
};

export const setTitle = (val: string): void => {
  if (topbarRef.current) topbarRef.current.setState({ title: val });
};

export const setProfile = (val: boolean): void => {
  if (topbarRef.current) topbarRef.current.setState({ profile: val });
};

export const setProfileOverride = (
  override: TopbarRouteAction | undefined
): void => {
  if (topbarRef.current)
    topbarRef.current.setState({ profileOverride: override });
};

export const setBackOverride = (
  backOverride: TopbarBackAction | undefined
): void => {
  if (topbarRef.current) topbarRef.current.setState({ backOverride });
};

export default Topbar;
