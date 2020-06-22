import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { View, Image } from 'react-native';
import { ProfilePicTypes } from 'types';
import { UserState } from '@store/User/UserTypes';
import AmeelioLogo from '@assets/Ameelio_Logo.png';
import ProfilePic from '../ProfilePic/ProfilePic.react';
import Styles from './Topbar.styles';

export interface Props {
  userState: UserState;
}

const TopbarBase: React.FC<Props> = (props: Props) => {
  const profilePic = props.userState.authInfo.isLoggedIn ? (
    <ProfilePic
      firstName={props.userState.user.firstName}
      lastName={props.userState.user.lastName}
      imageUri={props.userState.user.imageUri}
      type={ProfilePicTypes.TopbarProfile}
    />
  ) : (
    <View testID="blank" />
  );
  return (
    <View style={Styles.barContainer}>
      <View style={Styles.logoContainer}>
        <Image style={Styles.logo} source={AmeelioLogo} />
      </View>
      <View>{profilePic}</View>
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  userState: state.user,
});
const Topbar = connect(mapStateToProps)(TopbarBase);

export default Topbar;
