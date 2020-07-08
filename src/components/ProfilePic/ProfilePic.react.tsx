import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import { ProfilePicTypes } from 'types';
import ExamplePic from '@assets/ExamplePic.jpg';
import { NavigationContainerRef } from '@react-navigation/native';
import { Typography } from '@styles';
import Styles from './ProfilePic.styles';

export interface Props {
  firstName: string;
  lastName: string;
  imageUri?: string;
  type: ProfilePicTypes;
  navigation?: NavigationContainerRef | null;
}

function mapProfileTypeToStyle(type: ProfilePicTypes) {
  switch (type) {
    case ProfilePicTypes.Topbar:
      return { image: Styles.userPic, background: Styles.userBackground };
    case ProfilePicTypes.Contact:
      return { image: Styles.contactPic, background: Styles.contactBackground };
    case ProfilePicTypes.SingleContact:
      return {
        image: Styles.singleContactPic,
        background: Styles.singleContactBackground,
      };
    default:
      return {
        image: { width: 100, height: 100, borderRadius: 100 / 2 },
        background: {
          flex: 1,
        },
      };
  }
}

const ProfilePic: React.FC<Props> = (props: Props) => {
  let initials = '';
  if (props.firstName && props.lastName) {
    initials =
      props.firstName[0].toUpperCase() + props.lastName[0].toUpperCase();
  }

  let insideCircle = (
    <Text style={[Typography.FONT_REGULAR, Styles.initials]}>{initials}</Text>
  );

  if (props.imageUri) {
    insideCircle = (
      <Image
        style={mapProfileTypeToStyle(props.type).image}
        source={ExamplePic}
        accessibilityLabel="Profile Picture"
      />
    );
  }

  return (
    <TouchableOpacity
      style={mapProfileTypeToStyle(props.type).background}
      onPress={async () => {
        if (props.navigation) {
          props.navigation.navigate('UpdateProfile');
        }
      }}
      testID="profilePicture"
    >
      {insideCircle}
    </TouchableOpacity>
  );
};

export default ProfilePic;
