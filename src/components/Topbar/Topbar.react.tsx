import React, { createRef } from 'react';
import { View, Text, TouchableOpacity, Image, Keyboard } from 'react-native';
import { ProfilePicTypes, TopbarRouteAction, TopbarBackAction } from 'types';
import { UserState } from '@store/User/UserTypes';
import BackButton from '@assets/components/Topbar/BackButton';
import { Colors, Typography } from '@styles';
import { NavigationContainerRef } from '@react-navigation/native';
import Loading from '@assets/common/loading.gif';
import * as Segment from 'expo-analytics-segment';
import ProfilePic from '../ProfilePic/ProfilePic.react';
import Styles, { barHeight } from './Topbar.styles';
import Icon from '../Icon/Icon.react';

interface Props {
  userState: UserState;
  navigation: NavigationContainerRef | null;
}

interface State {
  shown: boolean;
  title: string;
  profile: boolean;
  blocked: boolean;
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
      title: '',
      profile: true,
      blocked: false,
    };
    this.renderBackButton = this.renderBackButton.bind(this);
  }

  renderBackButton(): JSX.Element | null {
    if (this.state.backOverride) {
      return (
        <TouchableOpacity
          style={Styles.backContainer}
          onPress={this.state.backOverride.action}
          testID="backButton"
        >
          <Icon svg={BackButton} />
        </TouchableOpacity>
      );
    }
    if (this.props.navigation && this.props.navigation.canGoBack()) {
      return (
        <TouchableOpacity
          style={Styles.backContainer}
          onPress={() => {
            if (this.props.navigation) {
              const route = this.props.navigation.getCurrentRoute()?.name;
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
        <TouchableOpacity
          activeOpacity={
            this.state.profileOverride?.enabled && !this.state.blocked
              ? 0.7
              : 1.0
          }
          onPress={async () => {
            if (this.state.profileOverride?.blocking) {
              if (this.state.profileOverride?.enabled && !this.state.blocked) {
                this.setState({ blocked: true });
                await this.state.profileOverride.action();
                this.setState({ blocked: false });
              }
            } else if (this.state.profileOverride?.enabled) {
              this.state.profileOverride.action();
            }
          }}
        >
          {this.state.blocked ? (
            <Image
              source={Loading}
              style={{ width: 25, height: 25, right: 10 }}
              testID="loading"
            />
          ) : (
            <Text
              style={[
                Typography.FONT_BOLD,
                {
                  color: this.state.profileOverride.enabled
                    ? Colors.PINK_500
                    : Colors.GRAY_MEDIUM,
                  fontSize: 16,
                },
              ]}
              testID="topRightText"
            >
              {this.state.profileOverride.text}
            </Text>
          )}
        </TouchableOpacity>
      );
    } else {
      topRight = <View testID="blank" />;
    }
    return (
      <TouchableOpacity
        style={[
          Styles.barContainer,
          {
            height: this.state.shown ? barHeight : 0,
            shadowColor: this.state.shown ? '#000' : '#fff',
            elevation: this.state.shown ? 5 : 0,
          },
        ]}
        activeOpacity={1.0}
        onPress={Keyboard.dismiss}
      >
        {this.renderBackButton()}
        <Text
          style={[
            Typography.FONT_MEDIUM,
            { fontSize: 16, color: Colors.GRAY_500 },
          ]}
        >
          {this.state.title}
        </Text>
        <View style={{ position: 'absolute', right: 19, paddingTop: 10 }}>
          {topRight}
        </View>
      </TouchableOpacity>
    );
  }
}

export const topbarRef = createRef<Topbar>();

export const setShown = (val: boolean): void => {
  if (topbarRef.current) topbarRef.current.setState({ shown: val });
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
