import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ProfilePicTypes } from 'types';
import { Typography } from '@styles';
import { navigate } from '@utils';
import { Screens } from '@utils/Screens';
import Styles from './ProfilePic.styles';
import AsyncImage from '../AsyncImage/AsyncImage.react';

export interface Props {
  firstName: string;
  lastName: string;
  imageUri?: string;
  type: ProfilePicTypes;
  disabled?: boolean;
}

function mapProfileTypeToStyle(type: ProfilePicTypes) {
  switch (type) {
    case ProfilePicTypes.ReferralDashboardConnection:
    case ProfilePicTypes.Topbar:
      return { image: Styles.userPic, background: Styles.userBackground };
    case ProfilePicTypes.ReferralDashboard:
      return {
        image: Styles.referralDashPic,
        background: Styles.referralDashBackground,
      };
    case ProfilePicTypes.Contact:
      return { image: Styles.contactPic, background: Styles.contactBackground };
    case ProfilePicTypes.SingleContact:
      return {
        image: Styles.singleContactPic,
        background: Styles.singleContactBackground,
      };
    case ProfilePicTypes.Avatar:
      return {
        image: Styles.avatarPic,
        background: Styles.avatarBackground,
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
    <Text
      style={[
        Typography.FONT_MEDIUM,
        props.type === ProfilePicTypes.SingleContact
          ? Styles.initialsBig
          : Styles.initials,
      ]}
    >
      {initials}
    </Text>
  );

  if (props.imageUri) {
    // instead of using the default image svg, let's just use the initials
    insideCircle =
      props.imageUri.indexOf('.svg') !== -1 ? (
        insideCircle
      ) : (
        <AsyncImage
          download
          loadingSize={20}
          viewStyle={mapProfileTypeToStyle(props.type).image}
          source={{ uri: props.imageUri }}
          accessibilityLabel="Profile Picture"
        />
      );
  }

  return (
    <View
      pointerEvents={
        props.type === ProfilePicTypes.Contact || props.disabled
          ? 'none'
          : 'auto'
      }
      style={mapProfileTypeToStyle(props.type).background}
    >
      <TouchableOpacity
        style={mapProfileTypeToStyle(props.type).background}
        onPress={async () => {
          if (props.disabled) return;
          if (props.type === ProfilePicTypes.SingleContact)
            navigate(Screens.UpdateContact);
          else if (props.type === ProfilePicTypes.Topbar)
            navigate(Screens.UpdateProfile);
        }}
        testID="profilePicture"
      >
        {insideCircle}
      </TouchableOpacity>
    </View>
  );
};

export default ProfilePic;
