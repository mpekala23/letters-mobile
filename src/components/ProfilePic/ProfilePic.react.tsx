import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { UserState } from '@store/User/UserTypes';
import { logout } from '@api';
import { dropdownError } from 'components/Dropdown/Dropdown.react';
import { ProfilePicTypes } from 'types';
import Styles from './ProfilePic.styles';

const ExamplePic = require('@assets/ExamplePic.jpg');

export interface Props {
  firstName: string;
  lastName: string;
  imageUri?: string;
  type: ProfilePicTypes;
}

const ProfilePic: React.FC<Props> = (props) => {
  let initials = '';
  if (props.firstName && props.lastName) {
    initials =
      props.firstName[0].toUpperCase() + props.lastName[0].toUpperCase();
  }

  let insideCircle = <Text style={Styles.initials}>{initials}</Text>;

  if (props.imageUri) {
    insideCircle = (
      <Image
        style={[
          props.type === ProfilePicTypes.TopbarProfile
            ? Styles.userPic
            : Styles.contactPic,
        ]}
        source={ExamplePic}
        accessibilityLabel="Profile Picture"
      />
    );
  }

  return (
    <TouchableOpacity
      style={[
        props.type === ProfilePicTypes.TopbarProfile
          ? Styles.userBackground
          : Styles.contactBackground,
      ]}
      onPress={async () => {
        try {
          // TODO: Have this press direct to Edit Profile screen once finished
          await logout();
        } catch (err) {
          dropdownError('Storage', 'Unable to successfully log out the user.');
        }
      }}
    >
      {insideCircle}
    </TouchableOpacity>
  );
};

export default ProfilePic;
