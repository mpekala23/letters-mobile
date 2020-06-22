import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { logout } from '@api';
import { dropdownError } from 'components/Dropdown/Dropdown.react';
import { ProfilePicTypes } from 'types';
import ExamplePic from '@assets/ExamplePic.jpg';
import i18n from '@i18n';
import Styles from './ProfilePic.styles';

const ExamplePic = require('@assets/ExamplePic.jpg');

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

  let insideCircle = <Text style={Styles.initials}>{initials}</Text>;

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
        try {
          // TODO: Have this press direct to Edit Profile screen once finished
          await logout();
        } catch (err) {
          dropdownError({
            message: i18n.t('Error.cantLogout'),
          });
        }
      }}
    >
      {insideCircle}
    </TouchableOpacity>
  );
};

export default ProfilePic;
