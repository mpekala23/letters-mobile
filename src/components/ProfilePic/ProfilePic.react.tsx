import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { UserState } from '@store/User/UserTypes';
import Styles from './ProfilePic.styles';

const ExamplePic = require('@assets/ExamplePic.jpg');

export interface Props {
  firstName: String;
  lastName: String;
  imageUri: String;
  displayUser?: Boolean;
  displayContact?: Boolean;
  displaySingleContact?: Boolean;
}

const ProfilePic: React.FC<Props> = (props) => {
  const initials = props.firstName[0].toUpperCase() + props.lastName[0].toUpperCase();

  let insideCircle = <Text style={Styles.initials}>{initials}</Text>;

  if (props.imageUri) {
    insideCircle = (
      <Image
        style={[
          props.displayContact ? Styles.contactPic : {},
          props.displaySingleContact ? Styles.singleContactPic : {},
          props.displayUser ? Styles.userPic : {},
        ]}
        source={ExamplePic}
        accessibilityLabel="Profile Picture"
      />
    );
  }

  return (
    <TouchableOpacity
      style={[
        props.displayContact ? Styles.contactBackground : {},
        props.displaySingleContact ? Styles.singleContactBackground : {},
        props.displayUser ? Styles.userBackground : {},
      ]}
    >
      {insideCircle}
    </TouchableOpacity>
  );
};

export default ProfilePic;
