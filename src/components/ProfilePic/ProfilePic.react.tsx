import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { UserState } from '@store/User/UserTypes';
import ExamplePic from '@assets/ExamplePic.jpg';
import Styles from './ProfilePic.styles';

export interface Props {
  userState: UserState;
}

const ProfilePicBase: React.FC<Props> = (props) => {
  if (!props.userState.authInfo.isLoggedIn) {
    return <View testID="blank" />;
  }
  const initials =
    props.userState.user.firstName[0].toUpperCase() +
    props.userState.user.lastName[0].toUpperCase();
  let insideCircle = <Text style={Styles.initials}>{initials}</Text>;
  if (props.userState.user.imageUri) {
    insideCircle = (
      <Image
        style={Styles.pic}
        source={ExamplePic}
        accessibilityLabel="ProfilePicture"
      />
    );
  }
  return (
    <TouchableOpacity style={Styles.background}>
      {insideCircle}
    </TouchableOpacity>
  );
};

const mapStateToProps = (state: AppState) => ({
  userState: state.user,
});
const ProfilePic = connect(mapStateToProps)(ProfilePicBase);

export default ProfilePic;
