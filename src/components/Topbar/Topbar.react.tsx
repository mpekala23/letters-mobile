import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { View, Text, TouchableOpacity } from 'react-native';
import { ProfilePicTypes } from 'types';
import { UserState } from '@store/User/UserTypes';
import { NavigationContainerRef } from '@react-navigation/native';
import ProfilePic from '../ProfilePic/ProfilePic.react';
import Styles from './Topbar.styles';

export interface Props {
  userState: UserState;
  navigation: NavigationContainerRef | null;
}

const TopbarBase: React.FC<Props> = (props: Props) => {
  const profilePic = props.userState.authInfo.isLoggedIn ? (
    <ProfilePic
      firstName={props.userState.user.firstName}
      lastName={props.userState.user.lastName}
      imageUri={props.userState.user.imageUri}
      type={ProfilePicTypes.Topbar}
    />
  ) : (
    <View testID="blank" />
  );
  console.log(props.navigation?.getRootState());
  return (
    <View style={Styles.barContainer}>
      <TouchableOpacity style={{ position: 'absolute', left: 0 }}>
        <Text>{props.navigation?.getRootState().routes.length}</Text>
      </TouchableOpacity>
      <Text>{props.navigation?.getCurrentRoute()?.name}</Text>
      <View style={{ position: 'absolute', right: 0 }}>{profilePic}</View>
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  userState: state.user,
});
const Topbar = connect(mapStateToProps)(TopbarBase);

export default Topbar;
