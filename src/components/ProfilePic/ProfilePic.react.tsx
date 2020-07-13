import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import { ProfilePicTypes } from 'types';
import { Typography } from '@styles';
import Avatar from '@assets/components/ProfilePic/Avatar';
import AvatarSmall from '@assets/components/ProfilePic/AvatarSmall';
import { navigate } from '@navigations';
import Icon from '../Icon/Icon.react';
import Styles from './ProfilePic.styles';

export interface Props {
  firstName: string;
  lastName: string;
  imageUri?: string;
  type: ProfilePicTypes;
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
    const avatar =
      props.type === ProfilePicTypes.SingleContact ? Avatar : AvatarSmall;
    insideCircle =
      props.imageUri.slice(props.imageUri.length - 4) === '.svg' ? (
        <Icon svg={avatar} />
      ) : (
        <Image
          style={mapProfileTypeToStyle(props.type).image}
          source={{ uri: props.imageUri }}
          accessibilityLabel="Profile Picture"
        />
      );
  }

  return (
    <TouchableOpacity
      style={mapProfileTypeToStyle(props.type).background}
      onPress={async () => {
        navigate('UpdateProfile');
      }}
      testID="profilePicture"
    >
      {insideCircle}
    </TouchableOpacity>
  );
};

export default ProfilePic;
