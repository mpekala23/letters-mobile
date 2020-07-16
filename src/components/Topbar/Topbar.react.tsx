import React, { createRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ProfilePicTypes, TopbarRouteAction } from 'types';
import { UserState } from '@store/User/UserTypes';
import BackButton from '@assets/components/Topbar/BackButton';
import { Colors, Typography } from '@styles';
import { NavigationContainerRef } from '@react-navigation/native';
import ProfilePic from '../ProfilePic/ProfilePic.react';
import Styles from './Topbar.styles';
import Icon from '../Icon/Icon.react';

interface Props {
  userState: UserState;
  navigation: NavigationContainerRef | null;
}

interface State {
  shown: boolean;
  title: string;
  profile: boolean;
  profileOverride?: {
    enabled: boolean;
    text: string;
    action: () => void;
  };
}

class Topbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      shown: false,
      title: '',
      profile: true,
    };
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
          activeOpacity={this.state.profileOverride?.enabled ? 0.7 : 1.0}
          onPress={() => {
            if (this.state.profileOverride?.enabled) {
              this.state.profileOverride.action();
            }
          }}
        >
          <Text
            style={[
              Typography.FONT_BOLD,
              {
                color: this.state.profileOverride.enabled
                  ? Colors.PINK_DARKER
                  : Colors.GRAY_MEDIUM,
                fontSize: 16,
              },
            ]}
          >
            {this.state.profileOverride.text}
          </Text>
        </TouchableOpacity>
      );
    } else {
      topRight = <View testID="blank" />;
    }
    return (
      <View
        style={[
          Styles.barContainer,
          { display: this.state.shown ? 'flex' : 'none' },
        ]}
      >
        {this.props.navigation && this.props.navigation.canGoBack() && (
          <TouchableOpacity
            style={Styles.backContainer}
            onPress={this.props.navigation.goBack}
            testID="backButton"
          >
            <Icon svg={BackButton} />
          </TouchableOpacity>
        )}
        <Text
          style={[
            Typography.FONT_MEDIUM,
            { fontSize: 16, color: Colors.GRAY_DARK },
          ]}
        >
          {this.state.title}
        </Text>
        <View style={{ position: 'absolute', right: 19 }}>{topRight}</View>
      </View>
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

export default Topbar;
