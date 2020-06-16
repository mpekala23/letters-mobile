import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { ProfilePicTypes } from 'types';
import Styles from './ProfilePic.styles';

const ExamplePic = require('@assets/ExamplePic.jpg');

export interface Props {
  firstName: String;
  lastName: String;
  imageUri: String;
  type: ProfilePicTypes;
}

const ProfilePic: React.FC<Props> = (props) => {
  let initials = '';
  if (props.firstName && props.lastName) {
    initials = props.firstName[0].toUpperCase() + props.lastName[0].toUpperCase();
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
