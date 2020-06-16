import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { UserState } from '@store/User/UserTypes';
import { ProfilePicTypes } from 'types';
import Styles from './ProfilePic.styles';

const ExamplePic = require('@assets/ExamplePic.jpg');

export interface Props {
  first_name: String;
  last_name: String;
  imageUri: String;
  type: ProfilePicTypes;
}

const ProfilePic: React.FC<Props> = (props) => {
  let initials = '';
  if (props.first_name && props.last_name) {
    initials = props.first_name[0].toUpperCase() + props.last_name[0].toUpperCase();
  }

  let insideCircle = <Text style={Styles.initials}>{initials}</Text>;

  if (props.imageUri) {
    insideCircle = (
      <Image
        style={[
          props.displayContact ? Styles.contactPic : {},
          props.displayUser ? Styles.userPic : {},
        ]}
        source={ExamplePic}
        accessibilityLabel='Profile Picture'
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
    >
      {insideCircle}
    </TouchableOpacity>
  );
};

export default ProfilePic;
