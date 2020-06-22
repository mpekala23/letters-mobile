import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import { logout } from '@api';
import { dropdownError } from 'components/Dropdown/Dropdown.react';
import { ProfilePicTypes } from 'types';
import ExamplePic from '@assets/ExamplePic.jpg';
import i18n from '@i18n';
import Styles from './ProfilePic.styles';

export interface Props {
  firstName: string;
  lastName: string;
  imageUri?: string;
  type: ProfilePicTypes;
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
