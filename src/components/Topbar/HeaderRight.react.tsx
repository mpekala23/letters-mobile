import Button from '@components/Button/Button.react';
import ProfilePic from '@components/ProfilePic/ProfilePic.react';
import { AppState } from '@store/types';
import { UserState } from '@store/User/UserTypes';
import { ProfilePicTypes, TopbarRouteAction } from 'types';
import React, { createRef } from 'react';
import { Keyboard, View } from 'react-native';
import { connect } from 'react-redux';
import Styles from './Topbar.styles';

interface Props {
  userState: UserState;
}

interface State {
  profile: boolean;
  profileOverride?: {
    enabled: boolean;
    text: string;
    action: () => void | Promise<void>;
    blocking?: boolean;
  };
}

class HeaderRightBase extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      profile: true,
    };
  }

  render() {
    let content = null;
    if (this.state.profile && this.props.userState.authInfo.isLoggedIn) {
      content = (
        <ProfilePic
          firstName={this.props.userState.user.firstName}
          lastName={this.props.userState.user.lastName}
          imageUri={this.props.userState.user.photo?.uri}
          type={ProfilePicTypes.Topbar}
        />
      );
    } else if (this.state.profileOverride) {
      content = (
        <Button
          enabled={this.state.profileOverride.enabled}
          blocking={this.state.profileOverride.blocking}
          onPress={async () => {
            Keyboard.dismiss();
            if (this.state.profileOverride)
              await this.state.profileOverride.action();
          }}
          buttonText={this.state.profileOverride.text}
          containerStyle={{ borderRadius: 20 }}
        />
      );
    }
    return (
      <View style={[Styles.sideContainer, Styles.rightContainer]}>
        {content}
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  userState: state.user,
});

const HeaderRightConnected = connect(mapStateToProps, null, null, {
  forwardRef: true,
})(HeaderRightBase);

export const headerRightRef = createRef<HeaderRightBase>();

const HeaderRight = (): JSX.Element => (
  <HeaderRightConnected ref={headerRightRef} />
);

export const setProfile = (val: boolean): void => {
  if (headerRightRef.current) headerRightRef.current.setState({ profile: val });
};

export const setProfileOverride = (
  override: TopbarRouteAction | undefined
): void => {
  if (headerRightRef.current)
    headerRightRef.current.setState({ profileOverride: override });
};

export default HeaderRight;
