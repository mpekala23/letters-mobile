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

function mapStyleToProfileType(type: String) {
  switch (type) {
    case ProfilePicTypes.TopbarProfile:
      return { image: Styles.userPic, background: Styles.userBackground };
    case ProfilePicTypes.ContactProfile:
      return { image: Styles.contactPic, background: Styles.contactBackground };
    case ProfilePicTypes.SingleContactProfile:
      return { image: Styles.singleContactPic, background: Styles.singleContactBackground };
    default:
      return { image: {}, background: {} };
  }
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
        style={[mapStyleToProfileType(props.type).image]}
        source={ExamplePic}
        accessibilityLabel="Profile Picture"
      />
    );
  }

  return (
    <TouchableOpacity style={[mapStyleToProfileType(props.type).background]}>
      {insideCircle}
    </TouchableOpacity>
  );
};

export default ProfilePic;
