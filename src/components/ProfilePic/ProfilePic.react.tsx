import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { connect } from "react-redux";
import { AppState } from "@store/types";
import { UserState } from "@store/User/UserTypes";
import Styles from "./ProfilePic.styles";
import { logout } from "@api";
import { dropdownError } from "components/Dropdown/Dropdown.react";
import { ProfilePicTypes } from 'types';

const ExamplePic = require('@assets/ExamplePic.jpg');

export interface Props {
  firstName: string;
  lastName: string;
  imageUri?: string;
  type: ProfilePicTypes;
}

function mapStyleToProfileType(type: String) {
  switch (type) {
    case ProfilePicTypes.Topbar:
      return { image: Styles.userPic, background: Styles.userBackground };
    case ProfilePicTypes.Contact:
      return { image: Styles.contactPic, background: Styles.contactBackground };
    case ProfilePicTypes.SingleContact:
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
    <TouchableOpacity
      style={[mapStyleToProfileType(props.type).background]}
      onPress={async () => {
        try {
          // TODO: Have this press direct to Edit Profile screen once finished
          await logout();
        } catch (err) {
          dropdownError("Storage", "Unable to successfully log out the user.");
        }
      }}
    >
      {insideCircle}
    </TouchableOpacity>
  );
};

export default ProfilePic;
