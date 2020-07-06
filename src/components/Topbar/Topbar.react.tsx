import React from 'react';
import { connect } from 'react-redux';
import { AppState } from '@store/types';
import { View, Text, TouchableOpacity } from 'react-native';
import { ProfilePicTypes } from 'types';
import { UserState } from '@store/User/UserTypes';
import BackButton from '@assets/components/Topbar/BackButton';
import ProfilePic from '../ProfilePic/ProfilePic.react';
import Styles from './Topbar.styles';
import Icon from '../Icon/Icon.react';

export interface Props {
  userState: UserState;
  label: string;
  profile: boolean;
  profileOverride?: {
    enabled: boolean;
    text: string;
    action: () => void;
  };
  backEnabled: boolean;
  back: () => void;
}

const TopbarBase: React.FC<Props> = (props: Props) => {
  let topRight;
  if (props.profile) {
    topRight = (
      <ProfilePic
        firstName={props.userState.user.firstName}
        lastName={props.userState.user.lastName}
        imageUri={props.userState.user.imageUri}
        type={ProfilePicTypes.Topbar}
      />
    );
  } else if (props.profileOverride) {
    topRight = (
      <TouchableOpacity onPress={props.profileOverride.action}>
        <Text
          style={{ color: props.profileOverride.enabled ? 'orange' : 'blue' }}
        >
          {props.profileOverride.text}
        </Text>
      </TouchableOpacity>
    );
  } else {
    topRight = <View testID="blank" />;
  }
  return (
    <View style={Styles.barContainer}>
      {props.backEnabled && (
        <TouchableOpacity
          style={{ position: 'absolute', left: 0 }}
          onPress={props.back}
        >
          <Icon svg={BackButton} />
        </TouchableOpacity>
      )}
      <Text>{props.label}</Text>
      <View style={{ position: 'absolute', right: 0 }}>{topRight}</View>
    </View>
  );
};

const mapStateToProps = (state: AppState) => ({
  userState: state.user,
});
const Topbar = connect(mapStateToProps)(TopbarBase);

export default Topbar;
